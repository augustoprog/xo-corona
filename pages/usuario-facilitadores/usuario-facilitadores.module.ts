import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioFacilitadoresPage } from './usuario-facilitadores';

@NgModule({
  declarations: [
    UsuarioFacilitadoresPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioFacilitadoresPage),
  ],
  exports: [
    UsuarioFacilitadoresPage
  ]
})
export class UsuarioFacilitadoresModule {}
