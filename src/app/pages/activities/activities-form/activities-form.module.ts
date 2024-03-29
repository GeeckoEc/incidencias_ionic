import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivitiesFormPageRoutingModule } from './activities-form-routing.module';

import { ActivitiesFormPage } from './activities-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitiesFormPageRoutingModule
  ],
  declarations: [ActivitiesFormPage]
})
export class ActivitiesFormPageModule {}
