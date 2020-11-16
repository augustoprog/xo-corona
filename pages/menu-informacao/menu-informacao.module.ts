import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuInformacaoPage } from './menu-informacao';

@NgModule({
  declarations: [
    MenuInformacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuInformacaoPage),
  ],
  exports: [
    MenuInformacaoPage
  ]
})
export class MenuInformacaoModule {}
