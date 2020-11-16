import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MenuAgendamentoPage } from "./menu-agendamento";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [MenuAgendamentoPage],
  imports: [IonicPageModule.forChild(MenuAgendamentoPage), ComponentsModule],
  exports: [MenuAgendamentoPage]
})
export class MenuAgendamentoPageModule {}
