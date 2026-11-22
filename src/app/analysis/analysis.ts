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
  readonly displayedColumns: (keyof QuestionAnswer | 'edit' | 'delete')[] = ['question', 'answer', 'edit', 'delete'];

  addQuestionAnswer(): void {
    if (this.state.addQuestionForm().invalid()) {
      this.state.addQuestionForm().markAsTouched();
      return;
    }
    this.state.questionAnswerList.update(list => ([...list, this.state.addQuestionForm().value()]));
    this.state.addQuestionForm().reset(StateService.emptyQuestionAnswer);
  }

  editQuestionAnswer(questionAnswer: QuestionAnswer): void {
    this.state.addQuestionForm().value.set(questionAnswer);
  }

  deleteQuestionAnswer(questionAnswer: QuestionAnswer): void {
    this.state.questionAnswerList.update(list => list.filter(item => item !== questionAnswer));
  }

}
