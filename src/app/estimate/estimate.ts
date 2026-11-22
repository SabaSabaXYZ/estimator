import { Component, inject, Injector, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { EstimationItem, StateService } from '../state-service';
import { SignalDataSource } from '../signal-data-source';
import { FieldTree, form, FormField } from '@angular/forms/signals';

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
  readonly displayedColumns: (keyof EstimationItem)[] = ['description', 'hours', 'enabled'];

  readonly addTaskState: WritableSignal<EstimationItem> = signal<EstimationItem>({
    description: '',
    hours: 0,
    enabled: true
  });

  readonly addTaskForm: FieldTree<EstimationItem> = form(this.addTaskState);

  addTask(): void {
    this.state.estimationList.update(list => ([...list, this.addTaskForm().value()]));
  }

  clearTasks(): void {
    this.state.estimationList.set([]);
  }

}
