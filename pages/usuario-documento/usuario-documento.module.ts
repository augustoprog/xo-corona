import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioDocumentoPage } from './usuario-documento';

@NgModule({
  declarations: [
    UsuarioDocumentoPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioDocumentoPage),
  ],
  exports: [
    UsuarioDocumentoPage
  ]
})
export class UsuarioDocumentoPageModule {}
