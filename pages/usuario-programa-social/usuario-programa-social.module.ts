import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioProgramaSocialPage } from './usuario-programa-social';

@NgModule({
  declarations: [
    UsuarioProgramaSocialPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioProgramaSocialPage),
  ],
  exports: [
    UsuarioProgramaSocialPage
  ]
})
export class UsuarioProgramaSocialPageModule {}
