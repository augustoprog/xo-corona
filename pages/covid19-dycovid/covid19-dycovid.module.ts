import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Covid19DycovidPage } from './covid19-dycovid';

@NgModule({
  declarations: [
    Covid19DycovidPage,
  ],
  imports: [
    IonicPageModule.forChild(Covid19DycovidPage),
  ],
})
export class Covid19DycovidPageModule {}
