import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AgendamentoConfirmarPage } from "./agendamento-confirmar";
import { ComponentsModule } from "../../../components/components.module";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AgendamentoConfirmarPage],
  imports: [
    IonicPageModule.forChild(AgendamentoConfirmarPage),
    ComponentsModule,
    FormsModule
  ]
})
export class AgendamentoConfirmarPageModule {}
