import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalOcupacaoPage } from './modal-ocupacao';

@NgModule({
  declarations: [
    ModalOcupacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalOcupacaoPage),
  ],
  exports: [
    ModalOcupacaoPage
  ]
})
export class ModalOcupacaoModule {}
