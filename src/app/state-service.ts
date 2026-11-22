import { computed, Service, Signal, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, min, required, validate } from '@angular/forms/signals';

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

export type EstimationItemErrors = Record<keyof EstimationItem, string>;
export type QuestionAnswerErrors = Record<keyof QuestionAnswer, string>;

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

  readonly fullAnalysis: Signal<string> = computed(() => {
    const questionAnswerList: QuestionAnswer[] = this.questionAnswerList();
    const estimationList: EstimationItem[] = this.estimationList();
    const total = `Total: ${this.total()}`;
    const questionAnswerString: string = questionAnswerList
      .map(({ question, answer }) => `Q: ${question}\nA: ${answer}\n`)
      .join('\n');
    const estimationString: string = estimationList
      .map(({ description, hours }) => `- ${description} → ${hours}\n`)
      .join('');
    return [questionAnswerString, estimationString, total].filter(x => x.length > 0).join('\n');
  });

}
