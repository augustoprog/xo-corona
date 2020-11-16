import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { UsuarioDocumentoEditarPage } from "./usuario-documento-editar";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [UsuarioDocumentoEditarPage],
  imports: [IonicPageModule.forChild(UsuarioDocumentoEditarPage), FormsModule],
  exports: [UsuarioDocumentoEditarPage]
})
export class UsuarioDocumentoEditarPageModule {}
