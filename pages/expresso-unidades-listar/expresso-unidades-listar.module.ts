import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpressoUnidadesListarPage } from './expresso-unidades-listar';

@NgModule({
  declarations: [
    ExpressoUnidadesListarPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpressoUnidadesListarPage),
  ],
  exports: [
    ExpressoUnidadesListarPage
  ]
})
export class ExpressoUnidadesListarPageModule {}
