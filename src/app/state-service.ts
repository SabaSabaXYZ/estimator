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
  readonly subtotal: Signal<number> = computed(() => this.estimationList().map(({ hours }) => hours).reduce((acc, val) => acc + val, 0));
  readonly total: Signal<number> = computed(() => this.subtotal() * 1.3);

}
