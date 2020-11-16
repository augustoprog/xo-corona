import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { UsuarioEnderecoEditarPage } from "./usuario-endereco-editar";
import { FormsModule } from "@angular/forms";
import { TextMaskModule } from "angular2-text-mask";
import { SelectBoxComponentModule } from "../../components/select-box/select-box.module";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [UsuarioEnderecoEditarPage],
  imports: [
    IonicPageModule.forChild(UsuarioEnderecoEditarPage),
    FormsModule,
    TextMaskModule,
    SelectBoxComponentModule,
    DirectivesModule
  ],
  exports: [UsuarioEnderecoEditarPage]
})
export class UsuarioEnderecoEditarPageModule {}
