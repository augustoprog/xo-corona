import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { UsuarioCadastroPage } from "./usuario-cadastro";
import { SelectBoxComponentModule } from "../../components/select-box/select-box.module";
import { TextMaskModule } from "angular2-text-mask";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [UsuarioCadastroPage],
  imports: [
    IonicPageModule.forChild(UsuarioCadastroPage),
    TextMaskModule,
    SelectBoxComponentModule,
    DirectivesModule
  ],
  exports: [UsuarioCadastroPage]
})
export class UsuarioCadastroModule {}
