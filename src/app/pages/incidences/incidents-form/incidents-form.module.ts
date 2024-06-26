import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentsFormPageRoutingModule } from './incidents-form-routing.module';

import { IncidentsFormPage } from './incidents-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IncidentsFormPageRoutingModule
  ],
  declarations: [IncidentsFormPage]
})
export class IncidentsFormPageModule {}
