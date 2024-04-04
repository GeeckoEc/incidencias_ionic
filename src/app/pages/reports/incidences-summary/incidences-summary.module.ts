import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidencesSummaryPageRoutingModule } from './incidences-summary-routing.module';

import { IncidencesSummaryPage } from './incidences-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidencesSummaryPageRoutingModule
  ],
  declarations: [IncidencesSummaryPage]
})
export class IncidencesSummaryPageModule {}
