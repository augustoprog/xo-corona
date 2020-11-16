import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioPreferenciaPage } from './usuario-preferencia';

@NgModule({
  declarations: [
    UsuarioPreferenciaPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioPreferenciaPage),
  ],
  exports: [
    UsuarioPreferenciaPage
  ]
})
export class UsuarioPreferenciaModule {}
