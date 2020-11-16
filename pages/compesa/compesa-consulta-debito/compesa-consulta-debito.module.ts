import { CompesaConsultaDebitoPage } from './compesa-consulta-debito';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    CompesaConsultaDebitoPage,
  ],
  imports: [
    IonicPageModule.forChild(CompesaConsultaDebitoPage),
  ],
  exports: [
    CompesaConsultaDebitoPage
  ]
})
export class CompesaConsultaDebitoModule {}
