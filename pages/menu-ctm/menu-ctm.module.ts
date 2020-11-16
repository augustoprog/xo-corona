import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuCtmPage } from './menu-ctm';

@NgModule({
  declarations: [
    MenuCtmPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuCtmPage),
  ],
  exports: [
    MenuCtmPage
  ]
})
export class MenuCtmPageModule {}
