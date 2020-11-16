import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PinSegurancaPage } from "./pin-seguranca";
import { TextMaskModule } from "../../../../node_modules/angular2-text-mask";

@NgModule({
  declarations: [PinSegurancaPage],
  imports: [IonicPageModule.forChild(PinSegurancaPage), TextMaskModule]
})
export class PinSegurancaPageModule {}
