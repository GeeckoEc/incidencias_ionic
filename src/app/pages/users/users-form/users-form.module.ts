import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersFormPageRoutingModule } from './users-form-routing.module';

import { UsersFormPage } from './users-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UsersFormPageRoutingModule
  ],
  declarations: [UsersFormPage]
})
export class UsersFormPageModule {}
