import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuServicoPage } from './menu-servico';

@NgModule({
  declarations: [
    MenuServicoPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuServicoPage),
  ],
  exports: [
    MenuServicoPage
  ]
})
export class MenuServicoModule {}
