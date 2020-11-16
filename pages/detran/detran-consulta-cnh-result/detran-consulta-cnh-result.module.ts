import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { DetranConsultaCnhResultPage } from "./detran-consulta-cnh-result";
import { DetranGrayBoxComponentModule } from "../../../components/detran-gray-box/detran-gray-box.module";

@NgModule({
  declarations: [DetranConsultaCnhResultPage],
  imports: [
    IonicPageModule.forChild(DetranConsultaCnhResultPage),
    DetranGrayBoxComponentModule
  ],
  exports: [DetranConsultaCnhResultPage]
})
export class DetranConsultaCnhResultModule {}
