import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/auth/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'main-start',
    loadChildren: () => import('./pages/start/main-start/main-start.module').then( m => m.MainStartPageModule)
  },
  {
    path: 'incidents-list',
    loadChildren: () => import('./pages/incidences/incidents-list/incidents-list.module').then( m => m.IncidentsListPageModule)
  },
  {
    path: 'incidents-form',
    loadChildren: () => import('./pages/incidences/incidents-form/incidents-form.module').then( m => m.IncidentsFormPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/auth/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },  {
    path: 'incidents-info',
    loadChildren: () => import('./pages/incidences/incidents-info/incidents-info.module').then( m => m.IncidentsInfoPageModule)
  },
  {
    path: 'users-selector',
    loadChildren: () => import('./pages/users/users-selector/users-selector.module').then( m => m.UsersSelectorPageModule)
  },
  {
    path: 'users-form',
    loadChildren: () => import('./pages/users/users-form/users-form.module').then( m => m.UsersFormPageModule)
  },
  {
    path: 'users-list',
    loadChildren: () => import('./pages/users/users-list/users-list.module').then( m => m.UsersListPageModule)
  },
  {
    path: 'activities-form',
    loadChildren: () => import('./pages/activities/activities-form/activities-form.module').then( m => m.ActivitiesFormPageModule)
  },
  {
    path: 'users-info',
    loadChildren: () => import('./pages/users/users-info/users-info.module').then( m => m.UsersInfoPageModule)
  },
  {
    path: 'incidences-summary',
    loadChildren: () => import('./pages/reports/incidences-summary/incidences-summary.module').then( m => m.IncidencesSummaryPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports/reports.module').then( m => m.ReportsPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
