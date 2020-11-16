import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PinDesbloquearPage } from "./pin-desbloquear";
import { TextMaskModule } from "../../../../node_modules/angular2-text-mask";

@NgModule({
  declarations: [PinDesbloquearPage],
  imports: [IonicPageModule.forChild(PinDesbloquearPage), TextMaskModule]
})
export class PinDesbloquearPageModule {}
