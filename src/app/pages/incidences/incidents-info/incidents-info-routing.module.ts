import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentsInfoPage } from './incidents-info.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentsInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentsInfoPageRoutingModule {}
