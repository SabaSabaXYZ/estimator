import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppState, StateService } from './state-service';

@Component({
  imports: [
    ClipboardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {

  readonly state: StateService = inject(StateService);

  async loadFile(): Promise<void> {
    const appState: AppState | null = await this.state.loadFile();
    if (appState === null) {
      return;
    }
    this.state.bufferForm().value.set(appState.buffer);
    this.state.questionAnswerList.set(appState.questionAnswerList);
    this.state.estimationList.set(appState.estimationItemList);
  }

}
