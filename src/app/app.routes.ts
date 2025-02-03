import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'providers',
        loadChildren: () => import('./features/providers/providers.module').then(m => m.ProvidersModule) // lazy loading
    },
    { path: '', redirectTo: '/providers', pathMatch: 'full' }
];
