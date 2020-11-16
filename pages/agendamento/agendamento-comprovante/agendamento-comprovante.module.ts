import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AgendamentoComprovantePage } from "./agendamento-comprovante";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [AgendamentoComprovantePage],
  imports: [
    IonicPageModule.forChild(AgendamentoComprovantePage),
    ComponentsModule
  ]
})
export class AgendamentoComprovantePageModule {}
