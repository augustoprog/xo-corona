import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioAlterarSenhaPage } from './usuario-alterar-senha';

@NgModule({
  declarations: [
    UsuarioAlterarSenhaPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioAlterarSenhaPage),
  ],
  exports: [
    UsuarioAlterarSenhaPage
  ]
})
export class UsuarioAlterarSenhaPageModule {}
