import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MenuAlertaCelularPage } from "./menu-alerta-celular";
import { FilterPipeModule } from "../../pipes/filter/filter.module";
@NgModule({
  declarations: [MenuAlertaCelularPage],
  imports: [IonicPageModule.forChild(MenuAlertaCelularPage), FilterPipeModule],
  exports: [MenuAlertaCelularPage]
})
export class MenuAlertaCelularPageModule {}
