import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpressoAntesDeIrPage } from './expresso-antes-de-ir';

@NgModule({
  declarations: [
    ExpressoAntesDeIrPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpressoAntesDeIrPage),
  ],
  exports: [
    ExpressoAntesDeIrPage
  ]
})
export class ExpressoAntesDeIrPageModule {}
