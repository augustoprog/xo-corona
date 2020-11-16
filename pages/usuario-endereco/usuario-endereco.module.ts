import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioEnderecoPage } from './usuario-endereco';

@NgModule({
  declarations: [
    UsuarioEnderecoPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioEnderecoPage),
  ],
  exports: [
    UsuarioEnderecoPage
  ]
})
export class UsuarioEnderecoPageModule {}
