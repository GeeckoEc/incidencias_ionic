import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainStartPage } from './main-start.page';

const routes: Routes = [
  {
    path: '',
    component: MainStartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainStartPageRoutingModule {}
