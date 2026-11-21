import { Analysis } from './analysis/analysis';
import { Estimate } from './estimate/estimate';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { title: 'Estimate', path: '/estimate', loadComponent: () => Estimate },
  { title: 'Analysis', path: '/analysis', loadComponent: () => Analysis },
];
