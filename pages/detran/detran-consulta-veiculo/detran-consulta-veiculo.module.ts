import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { DetranConsultaVeiculoPage } from "./detran-consulta-veiculo";
import { FormsModule } from "@angular/forms";
import { SelectBoxComponentModule } from "../../../components/select-box/select-box.module";
import { TextMaskModule } from "angular2-text-mask";
import { DirectivesModule } from "../../../directives/directives.module";

@NgModule({
  declarations: [DetranConsultaVeiculoPage],
  imports: [
    IonicPageModule.forChild(DetranConsultaVeiculoPage),
    FormsModule,
    SelectBoxComponentModule,
    TextMaskModule,
    DirectivesModule
  ],
  exports: [DetranConsultaVeiculoPage]
})
export class DetranConsultaVeiculoModule {}
