import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitiesFormPage } from './activities-form.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesFormPageRoutingModule {}
