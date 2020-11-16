import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompesaConsultaProtocoloResultPage } from './compesa-consulta-protocolo-result';

@NgModule({
  declarations: [
    CompesaConsultaProtocoloResultPage,
  ],
  imports: [
    IonicPageModule.forChild(CompesaConsultaProtocoloResultPage),
  ],
  exports: [
    CompesaConsultaProtocoloResultPage
  ]
})
export class CompesaConsultaProtocoloResultPageModule {}
