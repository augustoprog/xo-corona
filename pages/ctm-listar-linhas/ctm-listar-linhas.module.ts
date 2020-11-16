import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CtmListarLinhasPage } from "./ctm-listar-linhas";
import { FilterPipeModule } from "../../pipes/filter/filter.module";

@NgModule({
  declarations: [CtmListarLinhasPage],
  imports: [IonicPageModule.forChild(CtmListarLinhasPage), FilterPipeModule],
  exports: [CtmListarLinhasPage]
})
export class CtmListarLinhasPageModule {}
