import { MenuServicosDestaquePage } from "./menu-servicos-destaque";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ListaServicosComponent } from "../lista-servicos/lista-servicos";

@NgModule({
    declarations: [
        MenuServicosDestaquePage,
        ListaServicosComponent,
    ],
    imports: [
        IonicPageModule.forChild(MenuServicosDestaquePage),
    ],
    exports: [
        MenuServicosDestaquePage
    ]
})
export class MenuServicosDestaqueModule { }