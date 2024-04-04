import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidencesSummaryPage } from './incidences-summary.page';

const routes: Routes = [
  {
    path: '',
    component: IncidencesSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidencesSummaryPageRoutingModule {}
