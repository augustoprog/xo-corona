import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicPageModule } from "ionic-angular";
import { ComponentsModule } from "../../../components/components.module";
import { SelectBoxComponentModule } from "../../../components/select-box/select-box.module";
import { AgendamentoStepTwoPage } from "./agendamento-step-two";

@NgModule({
  declarations: [AgendamentoStepTwoPage],
  imports: [
    IonicPageModule.forChild(AgendamentoStepTwoPage),
    ComponentsModule,
    SelectBoxComponentModule,
    FormsModule
  ],
  exports: [AgendamentoStepTwoPage]
})
export class AgendamentoStepTwoPageModule {}
