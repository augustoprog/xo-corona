import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { DetranConsultaCnhPage } from "./detran-consulta-cnh";
import { FormsModule } from "@angular/forms";
import { TextMaskModule } from "angular2-text-mask";
import { CpfModule } from "@fikani/forms";

@NgModule({
  declarations: [DetranConsultaCnhPage],
  imports: [
    IonicPageModule.forChild(DetranConsultaCnhPage),
    FormsModule,
    TextMaskModule,
    CpfModule
  ],
  exports: [DetranConsultaCnhPage]
})
export class DetranConsultaCnhModule {}
