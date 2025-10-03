import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardPage, },
    { path: 'login', component: LoginPage },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
