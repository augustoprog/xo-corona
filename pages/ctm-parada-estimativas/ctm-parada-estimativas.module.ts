import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CtmParadaEstimativasPage } from './ctm-parada-estimativas';

@NgModule({
  declarations: [
    CtmParadaEstimativasPage,
  ],
  imports: [
    IonicPageModule.forChild(CtmParadaEstimativasPage),
  ],
  exports: [
    CtmParadaEstimativasPage
  ]
})
export class CtmParadaEstimativasPageModule {}
