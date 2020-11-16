import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicPageModule } from "ionic-angular";
import { ComponentsModule } from "../../../components/components.module";
import { SelectBoxComponentModule } from "../../../components/select-box/select-box.module";
import { AgendamentoStepOnePageConfirmation } from "./agendamento-step-one-confirmation";

@NgModule({
  declarations: [AgendamentoStepOnePageConfirmation],
  imports: [
    IonicPageModule.forChild(AgendamentoStepOnePageConfirmation),
    ComponentsModule,
    SelectBoxComponentModule,
    FormsModule
  ],
  exports: [AgendamentoStepOnePageConfirmation]
})
export class AgendamentoStepOnePageConfirmationModule {}
