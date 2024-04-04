import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainStartPageRoutingModule } from './main-start-routing.module';

import { MainStartPage } from './main-start.page';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainStartPageRoutingModule, 
    NgApexchartsModule
  ],
  declarations: [MainStartPage]
})
export class MainStartPageModule {}
