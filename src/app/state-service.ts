import { computed, Service, Signal, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, min, required, validate } from '@angular/forms/signals';
import { AutoSaveRequest, LoadResult, SaveResult } from '../electron-types';
import { combineLatest, debounceTime, filter, map, Observable, Subscription } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

export type QuestionAnswer = {
  id: number;
  question: string;
  answer: string;
};

export type EstimationItem = {
  id: number;
  description: string;
  hours: number;
};

export type AppState = {
  buffer: number;
  questionAnswerList: QuestionAnswer[];
  estimationItemList: EstimationItem[];
};

export type EstimationItemErrors = Record<keyof EstimationItem, string>;
export type QuestionAnswerErrors = Record<keyof QuestionAnswer, string>;

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function isAppState(value: unknown): value is AppState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!Object.hasOwn(value, 'buffer') || !Object.hasOwn(value, 'questionAnswerList') || !Object.hasOwn(value, 'estimationItemList')) {
    return false;
  }
  const semiparsedValue: AppState = value as AppState;
  if (!Number.isFinite(semiparsedValue.buffer) || !Array.isArray(semiparsedValue.questionAnswerList) || !Array.isArray(semiparsedValue.estimationItemList)) {
    return false;
  }
  return semiparsedValue.questionAnswerList.every(isQuestionAnswer) && semiparsedValue.estimationItemList.every(isEstimationItem);
}

export function isQuestionAnswer(value: unknown): value is QuestionAnswer {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!Object.hasOwn(value, 'id') || !Object.hasOwn(value, 'question') || !Object.hasOwn(value, 'answer')) {
    return false;
  }
  const semiparsedValue: QuestionAnswer = value as QuestionAnswer;
  return Number.isFinite(semiparsedValue.id) && typeof semiparsedValue.question === 'string' && typeof semiparsedValue.answer === 'string';
}

export function isEstimationItem(value: unknown): value is EstimationItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!Object.hasOwn(value, 'id') || !Object.hasOwn(value, 'description') || !Object.hasOwn(value, 'hours')) {
    return false;
  }
  const semiparsedValue: EstimationItem = value as EstimationItem;
  return Number.isFinite(semiparsedValue.id) && typeof semiparsedValue.description === 'string' && Number.isFinite(semiparsedValue.hours);
}

@Service()
export class StateService {

  static readonly emptyEstimationItem: EstimationItem = {
    id: 0,
    description: '',
    hours: 0
  };

  static readonly emptyQuestionAnswer: QuestionAnswer = {
    id: 0,
    question: '',
    answer: ''
  };

  readonly addTaskState: WritableSignal<EstimationItem> = signal<EstimationItem>(StateService.emptyEstimationItem);

  readonly addTaskForm: FieldTree<EstimationItem> = form(this.addTaskState, schemaPath => {
    required(schemaPath.description, { message: 'Please enter a task description' });
    required(schemaPath.hours, { message: 'Please enter the hours required' });
    min(schemaPath.hours, 1, { message: 'Hours must be positive' });
    validate(schemaPath.hours, ({ value }) => !Number.isSafeInteger(value()) ? { kind: 'integer', message: 'Must be a whole number' } : undefined);
  });

  readonly addTaskFormErrors: Signal<EstimationItemErrors> = computed(() => ({
    id: this.addTaskForm.id().errors().at(0)?.message ?? '',
    description: this.addTaskForm.description().errors().at(0)?.message ?? '',
    hours: this.addTaskForm.hours().errors().some(error => error.kind === 'parse') ? 'Must be a valid number' : this.addTaskForm.hours().errors().at(0)?.message ?? ''
  }));

  readonly addQuestionState: WritableSignal<QuestionAnswer> = signal<QuestionAnswer>(StateService.emptyQuestionAnswer);

  readonly addQuestionForm: FieldTree<QuestionAnswer> = form(this.addQuestionState, schemaPath => {
    required(schemaPath.question, { message: 'Please enter a question' });
  });

  readonly addQuestionFormErrors: Signal<QuestionAnswerErrors> = computed(() => ({
    id: this.addQuestionForm.id().errors().at(0)?.message ?? '',
    question: this.addQuestionForm.question().errors().at(0)?.message ?? '',
    answer: this.addQuestionForm.answer().errors().at(0)?.message ?? ''
  }));

  readonly questionAnswerList: WritableSignal<QuestionAnswer[]> = signal([]);
  readonly analysisPercentage: Signal<number> = computed(() => {
    const questionAnswerList: QuestionAnswer[] = this.questionAnswerList();
    const questionCount: number = questionAnswerList.length;
    if (questionCount === 0) {
      return 100;
    }
    const answerCount: number = questionAnswerList.filter(({ answer }) => answer !== '').length;
    return (answerCount * 100) / questionCount;
  });
  readonly estimationList: WritableSignal<EstimationItem[]> = signal([]);
  private readonly buffer: WritableSignal<number> = signal(0);
  readonly bufferForm: FieldTree<number> = form(this.buffer, schemaPath => min(schemaPath, 0, { message: 'Buffer must not be negative' }));
  private readonly bufferValue: Signal<number> = computed(() => this.bufferForm().valid() ? this.bufferForm().value() : 0);
  readonly subtotal: Signal<number> = computed(() => this.estimationList().map(({ hours }) => hours).reduce((acc, val) => acc + val, 0));
  readonly total: Signal<number> = computed(() => Math.ceil(this.subtotal() * (1 + this.bufferValue() / 100)));
  readonly filePath: WritableSignal<string | null> = signal(null);

  readonly fullAnalysis: Signal<string> = computed(() => {
    const questionAnswerList: QuestionAnswer[] = this.questionAnswerList();
    const estimationList: EstimationItem[] = this.estimationList();
    const total = `Total: ${this.total()} hours`;
    const questionAnswerString: string = questionAnswerList
      .map(({ question, answer }) => `Q: ${question}\nA: ${answer}\n`)
      .join('\n');
    const estimationString: string = estimationList
      .map(({ description, hours }) => `- ${description} → ${hours} hours\n`)
      .join('');
    return [questionAnswerString, estimationString, total].filter(x => x.length > 0).join('\n');
  });

  readonly appState: Signal<AppState> = computed(() => ({
    buffer: this.bufferValue(),
    questionAnswerList: this.questionAnswerList(),
    estimationItemList: this.estimationList()
  }));

  readonly autoSaveAction: Observable<AutoSaveRequest> = combineLatest({
    filePath: toObservable(this.filePath).pipe(filter(isNotNull)),
    appState: toObservable(this.appState)
  }).pipe(
    map(({ appState, filePath }) => ({ data: appState, filePath })),
    debounceTime(5000),
    takeUntilDestroyed()
  );

  readonly lastSaved: WritableSignal<Date | null> = signal(null);

  readonly executeAutoSaveAction: Subscription = this.autoSaveAction.subscribe(request => this.autoSaveFile(request));

  async autoSaveFile(request: AutoSaveRequest): Promise<void> {
    if (!window.electronAPI) {
      console.error('Not running inside Electron');
      return;
    }
    await window.electronAPI.autoSaveFile(request);
    this.lastSaved.set(new Date());
  }

  async saveFile(): Promise<void> {
    if (!window.electronAPI) {
      console.error('Not running inside Electron');
      return;
    }
    const result: SaveResult = await window.electronAPI.saveFile(this.appState());
    if (result.success) {
      this.filePath.set(result.filePath);
      this.lastSaved.set(new Date());
    }
  }

  async loadFile(): Promise<void> {
    if (!window.electronAPI) {
      console.error('Not running inside Electron');
      return;
    }
    const result: LoadResult = await window.electronAPI.loadFile();
    if (result.success && isAppState(result.data)) {
      this.filePath.set(result.filePath);
      this.bufferForm().value.set(result.data.buffer);
      this.questionAnswerList.set(result.data.questionAnswerList);
      this.estimationList.set(result.data.estimationItemList);
    }
  }

}
