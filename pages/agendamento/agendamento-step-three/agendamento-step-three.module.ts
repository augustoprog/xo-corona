import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ComponentsModule } from "../../../components/components.module";
import { AgendamentoStepThreePage } from "./agendamento-step-three";

@NgModule({
  declarations: [AgendamentoStepThreePage],
  imports: [
    IonicPageModule.forChild(AgendamentoStepThreePage),
    ComponentsModule
  ],
  exports: [AgendamentoStepThreePage]
})
export class AgendamentoStepThreePageModule {}
