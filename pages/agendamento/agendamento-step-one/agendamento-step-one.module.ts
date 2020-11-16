import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicPageModule } from "ionic-angular";
import { ComponentsModule } from "../../../components/components.module";
import { SelectBoxComponentModule } from "../../../components/select-box/select-box.module";
import { AgendamentoStepOnePage } from "./agendamento-step-one";

@NgModule({
  declarations: [AgendamentoStepOnePage],
  imports: [
    IonicPageModule.forChild(AgendamentoStepOnePage),
    ComponentsModule,
    SelectBoxComponentModule,
    FormsModule
  ],
  exports: [AgendamentoStepOnePage]
})
export class AgendamentoStepOnePageModule {}
