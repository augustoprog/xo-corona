import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuParticipePage } from './menu-participe';

@NgModule({
  declarations: [
    MenuParticipePage,
  ],
  imports: [
    IonicPageModule.forChild(MenuParticipePage),
  ],
  exports: [
    MenuParticipePage
  ]
})
export class MenuParticipeModule {}
