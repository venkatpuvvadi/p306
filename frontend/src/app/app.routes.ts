import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard';
import { UserDetailsComponent } from './components/user-details/user-details';
import { EditUserComponent } from './components/edit-user/edit-user';
import { inject } from '@angular/core';

import { AuthService } from './services/auth';

const authGuard = () => {
    const authService = inject(AuthService);
    if (authService.isAuthenticated()) return true;
    authService.logout();
    return false;
};

const adminGuard = () => {
    const authService = inject(AuthService);
    if (authService.isAuthenticated() && authService.isAdmin()) return true;
    return false; // Or redirect
};

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: 'admin/user/:id', component: UserDetailsComponent, canActivate: [adminGuard] },
    { path: 'admin/user/edit/:id', component: EditUserComponent, canActivate: [adminGuard] },
    { path: 'user', component: UserDashboardComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
