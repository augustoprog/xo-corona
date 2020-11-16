import { MenuCompesaPage } from './menu-compesa';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterPipeModule } from "../../pipes/filter/filter.module";

@NgModule({
  declarations: [
    MenuCompesaPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuCompesaPage),
    FilterPipeModule
  ],
  exports: [
    MenuCompesaPage
  ]
})
export class MenuCompesaModule { }
