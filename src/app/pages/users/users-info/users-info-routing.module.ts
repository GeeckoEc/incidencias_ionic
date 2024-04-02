import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersInfoPage } from './users-info.page';

const routes: Routes = [
  {
    path: '',
    component: UsersInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersInfoPageRoutingModule {}
