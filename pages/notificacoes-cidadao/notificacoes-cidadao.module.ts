import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificacoesCidadaoPage } from './notificacoes-cidadao';

@NgModule({
  declarations: [
    NotificacoesCidadaoPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificacoesCidadaoPage),
  ],
  exports: [
    NotificacoesCidadaoPage
  ]
})
export class NotificacoesCidadaoPageModule { }
