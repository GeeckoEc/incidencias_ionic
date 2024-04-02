import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersInfoPageRoutingModule } from './users-info-routing.module';

import { UsersInfoPage } from './users-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersInfoPageRoutingModule
  ],
  declarations: [UsersInfoPage]
})
export class UsersInfoPageModule {}
