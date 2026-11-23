import { computed, effect, EffectRef, Service, Signal, signal, WritableSignal } from '@angular/core';

type Theme = 'light' | 'dark';

@Service()
export class ThemeService {

  readonly localStorageKey: string = 'estimation-theme';
  readonly isDark: WritableSignal<boolean> = signal(localStorage.getItem(this.localStorageKey) === 'dark');
  readonly theme: Signal<Theme> = computed(() => this.isDark() ? 'dark' : 'light');
  readonly themeEffect: EffectRef = effect(() => {
    localStorage.setItem(this.localStorageKey, this.theme());
    const rootNode: HTMLBodyElement | null = document.querySelector('body');
    if (rootNode) {
      rootNode.className = this.theme();
    }
  });

}
