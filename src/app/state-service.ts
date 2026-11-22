import { computed, Service, Signal, signal, WritableSignal } from '@angular/core';

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

  readonly questionAnswerList: WritableSignal<QuestionAnswer[]> = signal([]);
  readonly estimationList: WritableSignal<EstimationItem[]> = signal([]);
  readonly buffer: WritableSignal<number> = signal(0);
  readonly subtotal: Signal<number> = computed(() => this.estimationList().map(({ hours }) => hours).reduce((acc, val) => acc + val, 0));
  readonly total: Signal<number> = computed(() => Math.ceil(this.subtotal() * (1 + this.buffer() / 100)));

}
