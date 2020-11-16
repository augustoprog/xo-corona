import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicoMapaPage } from './servico-mapa';

@NgModule({
  declarations: [
    ServicoMapaPage,
  ],
  imports: [
    IonicPageModule.forChild(ServicoMapaPage),
  ],
  exports: [
    ServicoMapaPage
  ]
})
export class ServicoMapaPageModule {}
