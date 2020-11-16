import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "ion2-calendar";
import { IonicPageModule } from "ionic-angular";
import { ComponentsModule } from "../../../components/components.module";
import { SelectBoxComponentModule } from "../../../components/select-box/select-box.module";
import { AgendamentoStepFivePage } from "./agendamento-step-five";

@NgModule({
  declarations: [AgendamentoStepFivePage],
  imports: [
    IonicPageModule.forChild(AgendamentoStepFivePage),
    CalendarModule,
    ComponentsModule,
    SelectBoxComponentModule,
    FormsModule
  ],
  exports: [AgendamentoStepFivePage]
})
export class AgendamentoStepFivePageModule {}
