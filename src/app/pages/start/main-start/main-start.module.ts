import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainStartPageRoutingModule } from './main-start-routing.module';

import { MainStartPage } from './main-start.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainStartPageRoutingModule
  ],
  declarations: [MainStartPage]
})
export class MainStartPageModule {}
