import { MenuServicosCartaPage } from './menu-servicos-carta';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    MenuServicosCartaPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuServicosCartaPage),
  ],
  exports: [
    MenuServicosCartaPage
  ]
})
export class MenuServicosCartaModule {}
