import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentsListPageRoutingModule } from './incidents-list-routing.module';

import { IncidentsListPage } from './incidents-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentsListPageRoutingModule
  ],
  declarations: [IncidentsListPage]
})
export class IncidentsListPageModule {}
