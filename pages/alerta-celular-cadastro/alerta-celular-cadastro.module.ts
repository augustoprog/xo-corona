import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AlertaCelularCadastroPage } from "./alerta-celular-cadastro";
import { FormsModule } from "@angular/forms";
import { SelectBoxComponentModule } from "../../components/select-box/select-box.module";
import { TextMaskModule } from "angular2-text-mask";

@NgModule({
  declarations: [AlertaCelularCadastroPage],
  imports: [
    IonicPageModule.forChild(AlertaCelularCadastroPage),
    FormsModule,
    SelectBoxComponentModule,
    TextMaskModule
  ],
  exports: [AlertaCelularCadastroPage]
})
export class AlertaCelularCadastroPageModule {}
