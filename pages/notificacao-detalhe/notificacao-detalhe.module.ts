import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificacaoDetalhePage } from './notificacao-detalhe';

@NgModule({
  declarations: [
    NotificacaoDetalhePage,
  ],
  imports: [
    IonicPageModule.forChild(NotificacaoDetalhePage),
  ],
  exports: [
    NotificacaoDetalhePage
  ]
})
export class NotificacaoDetalhePageModule { }
