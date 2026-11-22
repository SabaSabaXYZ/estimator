import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { StateService } from '../state-service';

@Component({
  imports: [
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

  readonly state: StateService = inject(StateService);

}
