import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioDocumentoListaTiposPage } from './usuario-documento-lista-tipos';

@NgModule({
  declarations: [
    UsuarioDocumentoListaTiposPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioDocumentoListaTiposPage),
  ],
  exports: [
    UsuarioDocumentoListaTiposPage
  ]
})
export class UsuarioDocumentoListaTiposPageModule {}
