import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicPageModule } from "ionic-angular";
import { ComponentsModule } from "../../../components/components.module";
import { AgendamentoStepFourPage } from "./agendamento-step-four";

@NgModule({
  declarations: [AgendamentoStepFourPage],
  imports: [
    IonicPageModule.forChild(AgendamentoStepFourPage),
    ComponentsModule,
    FormsModule
  ],
  exports: [AgendamentoStepFourPage]
})
export class AgendamentoStepFourPageModule {}
