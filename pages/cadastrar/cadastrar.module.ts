import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { CadastrarPage } from "./cadastrar";
import { TextMaskModule } from "angular2-text-mask";
import { SelectBoxComponentModule } from "../../components/select-box/select-box.module";
import { FikaniFormsModule, CpfModule } from "@fikani/forms";
import { DirectivesModule } from "../../directives/directives.module";
@NgModule({
    declarations: [CadastrarPage],
    imports: [
        IonicPageModule.forChild(CadastrarPage),
        TextMaskModule,
        SelectBoxComponentModule,
        CpfModule,
        FikaniFormsModule,
        DirectivesModule,
    ],
    exports: [CadastrarPage]
})
export class CadastrarModule { }
