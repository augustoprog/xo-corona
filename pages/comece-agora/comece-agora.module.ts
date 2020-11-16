import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComeceAgoraPage } from './comece-agora';

@NgModule({
  declarations: [
    ComeceAgoraPage,
  ],
  imports: [
    IonicPageModule.forChild(ComeceAgoraPage),
  ],
  exports: [
    ComeceAgoraPage
  ]
})
export class ComeceAgoraModule {}
