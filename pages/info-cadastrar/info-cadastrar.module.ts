import { NgModule } from "@angular/core";
import { InfoCadastrarPage } from "./info-cadastrar";
import { IonicPageModule } from "ionic-angular";

@NgModule({
    declarations: [InfoCadastrarPage],
    imports: [
        IonicPageModule.forChild(InfoCadastrarPage),
    ],
    exports: [InfoCadastrarPage]
})
export class InfoCadastrarModule { }