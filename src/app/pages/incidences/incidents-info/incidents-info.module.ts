import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentsInfoPageRoutingModule } from './incidents-info-routing.module';

import { IncidentsInfoPage } from './incidents-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentsInfoPageRoutingModule
  ],
  declarations: [IncidentsInfoPage]
})
export class IncidentsInfoPageModule {}
