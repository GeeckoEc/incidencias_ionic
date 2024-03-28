import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersFormPageRoutingModule } from './users-form-routing.module';

import { UsersFormPage } from './users-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersFormPageRoutingModule
  ],
  declarations: [UsersFormPage]
})
export class UsersFormPageModule {}
