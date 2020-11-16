import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ModalMunicipioPage } from "./modal-municipio";

@NgModule({
  declarations: [ModalMunicipioPage],
  imports: [IonicPageModule.forChild(ModalMunicipioPage)],
  exports: [ModalMunicipioPage]
})
export class ModalMunicipioPageModule {}
