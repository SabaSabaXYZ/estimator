import { Analysis } from './analysis/analysis';
import { Estimate } from './estimate/estimate';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { title: 'Estimate', path: '', pathMatch: 'full', loadComponent: () => Estimate },
  { title: 'Analysis', path: 'analysis', pathMatch: 'full', loadComponent: () => Analysis },
];
