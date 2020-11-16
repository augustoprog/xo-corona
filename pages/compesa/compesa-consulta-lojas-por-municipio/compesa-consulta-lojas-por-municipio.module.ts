import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CompesaConsultaLojasPorMunicipioPage } from "./compesa-consulta-lojas-por-municipio";
import { FilterPipeModule } from "../../../pipes/filter/filter.module";

@NgModule({
  declarations: [CompesaConsultaLojasPorMunicipioPage],
  imports: [
    IonicPageModule.forChild(CompesaConsultaLojasPorMunicipioPage),
    FilterPipeModule
  ],
  exports: [CompesaConsultaLojasPorMunicipioPage]
})
export class CompesaConsultaLojasPorMunicipioPageModule {}
