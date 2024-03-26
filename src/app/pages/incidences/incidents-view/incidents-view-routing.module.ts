import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentsViewPage } from './incidents-view.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentsViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentsViewPageRoutingModule {}
