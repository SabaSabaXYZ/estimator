import { computed, Service, Signal, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, min, required } from '@angular/forms/signals';

export type QuestionAnswer = {
  question: string;
  answer: string;
};

export type EstimationItem = {
  description: string;
  hours: number;
};

@Service()
export class StateService {

  static readonly emptyEstimationItem: EstimationItem = {
    description: '',
    hours: 0
  };

  readonly addTaskState: WritableSignal<EstimationItem> = signal<EstimationItem>(StateService.emptyEstimationItem);

  readonly addTaskForm: FieldTree<EstimationItem> = form(this.addTaskState, schemaPath => {
    required(schemaPath.description, { message: 'Please enter a task description' });
    required(schemaPath.hours, { message: 'Please enter the hours required' });
    min(schemaPath.hours, 1, { message: 'Hours must be positive' });
  });

  readonly questionAnswerList: WritableSignal<QuestionAnswer[]> = signal([]);
  readonly estimationList: WritableSignal<EstimationItem[]> = signal([]);
  private readonly buffer: WritableSignal<number> = signal(0);
  readonly bufferForm: FieldTree<number> = form(this.buffer, schemaPath => min(schemaPath, 0, { message: 'Buffer must not be negative' }));
  private readonly bufferValue: Signal<number> = computed(() => this.bufferForm().valid() ? this.bufferForm().value() : 0);
  readonly subtotal: Signal<number> = computed(() => this.estimationList().map(({ hours }) => hours).reduce((acc, val) => acc + val, 0));
  readonly total: Signal<number> = computed(() => Math.ceil(this.subtotal() * (1 + this.bufferValue() / 100)));

}
