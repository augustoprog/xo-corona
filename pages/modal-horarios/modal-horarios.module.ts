import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ModalHorariosPage } from "./modal-horarios";

@NgModule({
  declarations: [ModalHorariosPage],
  imports: [IonicPageModule.forChild(ModalHorariosPage)],
  exports: [ModalHorariosPage]
})
export class ModalHorariosPageModule {}
