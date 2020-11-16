import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EsqueciSenhaPage } from './esqueci-senha';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    EsqueciSenhaPage,
  ],
  imports: [
    DirectivesModule,
    IonicPageModule.forChild(EsqueciSenhaPage),
  ],
  exports: [
    EsqueciSenhaPage
  ]
})
export class EsqueciSenhaPageModule {}
