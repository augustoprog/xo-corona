import { MenuOrgaosCartaPage } from "./menu-orgaos-carta";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { FilterPipeModule } from "../../../pipes/filter/filter.module";

@NgModule({
  declarations: [MenuOrgaosCartaPage],
  imports: [IonicPageModule.forChild(MenuOrgaosCartaPage), FilterPipeModule],
  exports: [MenuOrgaosCartaPage]
})
export class MenuOrgaosCartaModule {}
