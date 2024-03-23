import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentsListPage } from './incidents-list.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentsListPageRoutingModule {}
