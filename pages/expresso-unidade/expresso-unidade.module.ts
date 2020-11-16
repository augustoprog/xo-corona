import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpressoUnidadePage } from './expresso-unidade';

@NgModule({
  declarations: [
    ExpressoUnidadePage,
  ],
  imports: [
    IonicPageModule.forChild(ExpressoUnidadePage),
  ],
  exports: [
    ExpressoUnidadePage
  ]
})
export class ExpressoUnidadePageModule {}
