import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { MatIconRegistry } from '@angular/material/icon';

function addMaterialSymbolsOutlined(): void {
  const iconRegistery: MatIconRegistry = inject(MatIconRegistry);
  const outlinedFontSetClasses: string[] = iconRegistery.getDefaultFontSetClass().filter(fontSetClass => fontSetClass !== 'material-icons');
  iconRegistery.setDefaultFontSetClass(...outlinedFontSetClasses, 'material-symbols-outlined');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideAppInitializer(addMaterialSymbolsOutlined)
  ]
};
