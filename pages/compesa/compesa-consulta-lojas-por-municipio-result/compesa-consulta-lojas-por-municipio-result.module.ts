import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompesaConsultaLojasPorMunicipioResultPage } from './compesa-consulta-lojas-por-municipio-result';

@NgModule({
  declarations: [
    CompesaConsultaLojasPorMunicipioResultPage,
  ],
  imports: [
    IonicPageModule.forChild(CompesaConsultaLojasPorMunicipioResultPage),
  ],
  exports: [
    CompesaConsultaLojasPorMunicipioResultPage
  ]
})
export class CompesaConsultaLojasPorMunicipioResultPageModule {}
