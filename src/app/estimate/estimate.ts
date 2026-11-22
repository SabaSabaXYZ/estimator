import { Component, effect, inject, Injector, Signal, viewChild } from '@angular/core';
import { EstimationItem, StateService } from '../state-service';
import { FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { SignalDataSource } from '../signal-data-source';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatTableModule
  ],
  selector: 'app-estimate',
  styleUrl: './estimate.scss',
  templateUrl: './estimate.html',
})
export class Estimate {

  readonly injector: Injector = inject(Injector);
  readonly state: StateService = inject(StateService);
  readonly sort: Signal<MatSort> = viewChild.required(MatSort);
  readonly dataSource: SignalDataSource<EstimationItem> = new SignalDataSource<EstimationItem>(this.state.estimationList, this.injector);
  readonly displayedColumns: (keyof EstimationItem | 'edit' | 'delete')[] = ['description', 'hours', 'edit', 'delete'];
  readonly updateSort = effect(() => this.dataSource.matSort = this.sort());

  normalizeIds(): void {
    this.state.estimationList.update(list => [...list].sort((a, b) => a.id - b.id).map(({ description, hours }, id) => ({ id: id + 1, description, hours })));
  }

  handleSubmit(): void {
    if (this.state.addTaskForm().value().id === 0) {
      this.addTask();
    } else {
      this.updateTask();
    }
    this.normalizeIds();
  }

  addTask(): void {
    if (this.state.addTaskForm().invalid()) {
      this.state.addTaskForm().markAsTouched();
      return;
    }
    const lastId: number = this.state.estimationList().at(-1)?.id ?? 0;
    const newValue: EstimationItem = { ...this.state.addTaskForm().value(), id: lastId + 1 };
    this.state.estimationList.update(list => ([...list, newValue]));
    this.state.addTaskForm().reset(StateService.emptyEstimationItem);
  }

  updateTask(): void {
    if (this.state.addTaskForm().invalid()) {
      this.state.addTaskForm().markAsTouched();
      return;
    }
    this.deleteTask(this.state.addTaskForm().value());
    this.state.estimationList.update(list => ([...list, this.state.addTaskForm().value()]));
    this.state.addTaskForm().reset(StateService.emptyEstimationItem);
  }

  editTask(task: EstimationItem): void {
    this.state.addTaskForm().value.set(task);
  }

  deleteTask(task: EstimationItem): void {
    this.state.estimationList.update(list => list.filter(item => item.id !== task.id));
    this.normalizeIds();
  }

}
