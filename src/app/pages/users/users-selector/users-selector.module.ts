import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersSelectorPageRoutingModule } from './users-selector-routing.module';

import { UsersSelectorPage } from './users-selector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersSelectorPageRoutingModule
  ],
  declarations: [UsersSelectorPage]
})
export class UsersSelectorPageModule {}
