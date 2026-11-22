import { Component, inject, Injector } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { QuestionAnswer, StateService } from '../state-service';
import { SignalDataSource } from '../signal-data-source';

@Component({
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule
  ],
  selector: 'app-analysis',
  styleUrl: './analysis.scss',
  templateUrl: './analysis.html',
})
export class Analysis {

  readonly injector: Injector = inject(Injector);
  readonly state: StateService = inject(StateService);
  readonly dataSource: SignalDataSource<QuestionAnswer> = new SignalDataSource<QuestionAnswer>(this.state.questionAnswerList, this.injector);
  readonly displayedColumns: (keyof QuestionAnswer | 'edit' | 'delete')[] = ['id', 'question', 'answer', 'edit', 'delete'];

  normalizeIds(): void {
    this.state.questionAnswerList.update(list => [...list].sort((a, b) => a.id - b.id).map(({ question, answer }, id) => ({ id: id + 1, question, answer })));
  }

  handleSubmit(): void {
    if (this.state.addQuestionForm().value().id === 0) {
      this.addQuestionAnswer();
    } else {
      this.updateQuestionAnswer();
    }
    this.normalizeIds();
  }

  addQuestionAnswer(): void {
    if (this.state.addQuestionForm().invalid()) {
      this.state.addQuestionForm().markAsTouched();
      return;
    }
    const lastId: number = this.state.questionAnswerList().at(-1)?.id ?? 0;
    const newValue: QuestionAnswer = { ...this.state.addQuestionForm().value(), id: lastId + 1 };
    this.state.questionAnswerList.update(list => ([...list, newValue]));
    this.state.addQuestionForm().reset(StateService.emptyQuestionAnswer);
  }

  updateQuestionAnswer(): void {
    if (this.state.addQuestionForm().invalid()) {
      this.state.addQuestionForm().markAsTouched();
      return;
    }
    this.deleteQuestionAnswer(this.state.addQuestionForm().value());
    this.state.questionAnswerList.update(list => ([...list, this.state.addQuestionForm().value()]));
    this.state.addQuestionForm().reset(StateService.emptyQuestionAnswer);
  }

  editQuestionAnswer(questionAnswer: QuestionAnswer): void {
    this.state.addQuestionForm().value.set(questionAnswer);
  }

  deleteQuestionAnswer(questionAnswer: QuestionAnswer): void {
    this.state.questionAnswerList.update(list => list.filter(item => item.id !== questionAnswer.id));
    this.normalizeIds();
  }

}
