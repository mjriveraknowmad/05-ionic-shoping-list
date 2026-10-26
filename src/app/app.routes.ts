import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'shoping-list',
    pathMatch: 'full',
  },
  {
    path: 'shoping-list',
    loadComponent: () =>
      import('./pages/shoping-list/shoping-list.page').then(
        (m) => m.ShopingListPage
      ),
  },
];
