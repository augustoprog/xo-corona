import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ChaveSegurancaPage } from "./chave-seguranca";
import { ComponentsModule } from "../../../components/components.module";

@NgModule({
  declarations: [ChaveSegurancaPage],
  imports: [IonicPageModule.forChild(ChaveSegurancaPage), ComponentsModule]
})
export class ChaveSegurancaPageModule {}
