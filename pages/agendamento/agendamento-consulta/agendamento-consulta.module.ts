import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AgendamentoConsultaPage } from "./agendamento-consulta";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [AgendamentoConsultaPage],
  imports: [
    IonicPageModule.forChild(AgendamentoConsultaPage),
    ComponentsModule
  ],
  exports: [AgendamentoConsultaPage]
})
export class AgendamentoConsultaPageModule {}
