import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { GerarQrCodePage } from "./gerar-qr-code";
import { NgxQRCodeModule } from "../../../../node_modules/ngx-qrcode2";

@NgModule({
  declarations: [GerarQrCodePage],
  imports: [IonicPageModule.forChild(GerarQrCodePage), NgxQRCodeModule]
})
export class GerarQrCodePageModule {}
