import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CompesaConsultaProtocoloPage } from "./compesa-consulta-protocolo";
import { FormsModule } from "@angular/forms";
import { DirectivesModule } from "../../../directives/directives.module";

@NgModule({
  declarations: [CompesaConsultaProtocoloPage],
  imports: [
    IonicPageModule.forChild(CompesaConsultaProtocoloPage),
    FormsModule,
    DirectivesModule
  ],
  exports: [CompesaConsultaProtocoloPage]
})
export class CompesaConsultaProtocoloPageModule {}
