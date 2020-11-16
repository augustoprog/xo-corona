import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { UsuarioContatoEditarPage } from "./usuario-contato-editar";

@NgModule({
  declarations: [UsuarioContatoEditarPage],
  imports: [IonicPageModule.forChild(UsuarioContatoEditarPage)],
  exports: [UsuarioContatoEditarPage]
})
export class UsuarioContatoEditarPageModule {}
