import { CompesaConsultaHistoricoContadorPage } from './compesa-consulta-historico-contador';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    CompesaConsultaHistoricoContadorPage,
  ],
  imports: [
    IonicPageModule.forChild(CompesaConsultaHistoricoContadorPage),
  ],
  exports: [
    CompesaConsultaHistoricoContadorPage
  ],
  providers: [ DatePipe]
})
export class CompesaConsultaHistoricoContadorModule {}
