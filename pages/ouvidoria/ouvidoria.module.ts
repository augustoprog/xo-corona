import { NgModule } from "@angular/core";
import { OuvidoriaPage } from "./ouvidoria";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [OuvidoriaPage],
  imports: [
    IonicPageModule.forChild(OuvidoriaPage)
  ],
  exports: [OuvidoriaPage]
})
export class OuvidoriaPageModule {}