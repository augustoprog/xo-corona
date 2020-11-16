import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { UsuarioContatoListaTiposPage } from "./usuario-contato-lista-tipos";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [UsuarioContatoListaTiposPage],
  imports: [
    IonicPageModule.forChild(UsuarioContatoListaTiposPage),
    FormsModule
  ],
  exports: [UsuarioContatoListaTiposPage]
})
export class UsuarioContatoListaTiposPageModule {}
