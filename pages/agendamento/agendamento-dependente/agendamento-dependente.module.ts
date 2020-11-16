import { NgModule } from '@angular/core';
import { CpfModule } from "@fikani/forms";
import { TextMaskModule } from "angular2-text-mask";
import { IonicPageModule } from 'ionic-angular';
import { AgendamentoDependentePage } from './agendamento-dependente';

@NgModule({
  declarations: [
    AgendamentoDependentePage,
  ],
  imports: [
    IonicPageModule.forChild(AgendamentoDependentePage),
    TextMaskModule,
    CpfModule
  ],
})
export class AgendamentoDependentePageModule {}
