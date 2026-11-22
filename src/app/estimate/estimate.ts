import { Component, inject, Injector, signal, WritableSignal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { EstimationItem, StateService } from '../state-service';
import { FieldTree, form, FormField, min, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { SignalDataSource } from '../signal-data-source';

@Component({
  imports: [
    CurrencyPipe,
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule
  ],
  selector: 'app-estimate',
  styleUrl: './estimate.scss',
  templateUrl: './estimate.html',
})
export class Estimate {

  readonly injector: Injector = inject(Injector);
  readonly state: StateService = inject(StateService);
  readonly dataSource: SignalDataSource<EstimationItem> = new SignalDataSource<EstimationItem>(this.state.estimationList, this.injector);
  readonly displayedColumns: (keyof EstimationItem)[] = ['description', 'hours'];

  readonly emptyEstimationItem: EstimationItem = {
    description: '',
    hours: 0
  };

  readonly addTaskState: WritableSignal<EstimationItem> = signal<EstimationItem>(this.emptyEstimationItem);

  readonly addTaskForm: FieldTree<EstimationItem> = form(this.addTaskState, schemaPath => {
    required(schemaPath.description, { message: 'Please enter a task description' });
    required(schemaPath.hours, { message: 'Please enter the hours required' });
    min(schemaPath.hours, 1, { message: 'Hours must be positive' });
  });

  addTask(): void {
    if (this.addTaskForm().invalid()) {
      this.addTaskForm().markAsTouched();
      return;
    }
    this.state.estimationList.update(list => ([...list, this.addTaskForm().value()]));
    this.addTaskForm().reset(this.emptyEstimationItem);
  }

  clearTasks(): void {
    this.state.estimationList.set([]);
  }

}
