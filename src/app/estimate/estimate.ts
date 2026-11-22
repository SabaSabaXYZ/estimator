import { Component, inject, Injector } from '@angular/core';
import { EstimationItem, StateService } from '../state-service';
import { FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
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
  selector: 'app-estimate',
  styleUrl: './estimate.scss',
  templateUrl: './estimate.html',
})
export class Estimate {

  readonly injector: Injector = inject(Injector);
  readonly state: StateService = inject(StateService);
  readonly dataSource: SignalDataSource<EstimationItem> = new SignalDataSource<EstimationItem>(this.state.estimationList, this.injector);
  readonly displayedColumns: (keyof EstimationItem | 'delete')[] = ['description', 'hours', 'delete'];

  addTask(): void {
    if (this.state.addTaskForm().invalid()) {
      this.state.addTaskForm().markAsTouched();
      return;
    }
    this.state.estimationList.update(list => ([...list, this.state.addTaskForm().value()]));
    this.state.addTaskForm().reset(StateService.emptyEstimationItem);
  }

  clearTasks(): void {
    this.state.estimationList.set([]);
  }

  deleteTask(task: EstimationItem): void {
    this.state.estimationList.update(list => list.filter(item => item !== task));
  }

}
