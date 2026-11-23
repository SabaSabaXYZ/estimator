import { AppState, StateService } from './state-service';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './theme-service';

@Component({
  imports: [
    ClipboardModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSlideToggleModule,
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
  readonly theme: ThemeService = inject(ThemeService);

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
