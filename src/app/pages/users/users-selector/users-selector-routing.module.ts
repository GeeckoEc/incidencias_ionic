import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersSelectorPage } from './users-selector.page';

const routes: Routes = [
  {
    path: '',
    component: UsersSelectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersSelectorPageRoutingModule {}
