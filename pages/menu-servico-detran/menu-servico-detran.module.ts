import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MenuServicoDetranPage } from "./menu-servico-detran";
import { FilterPipeModule } from "../../pipes/filter/filter.module";

@NgModule({
  declarations: [MenuServicoDetranPage],
  imports: [IonicPageModule.forChild(MenuServicoDetranPage), FilterPipeModule],
  exports: [MenuServicoDetranPage]
})
export class MenuServicoDetranModule {}
