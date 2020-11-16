import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioContatoPage } from './usuario-contato';

@NgModule({
  declarations: [
    UsuarioContatoPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioContatoPage),
  ],
  exports: [
    UsuarioContatoPage
  ]
})
export class UsuarioContatoModule {}
