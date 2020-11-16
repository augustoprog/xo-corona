import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { FaleConoscoPage } from "./fale-conosco";
import { FormsModule } from "@angular/forms";
import { SelectBoxComponentModule } from "../../components/select-box/select-box.module";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [FaleConoscoPage],
  imports: [
    IonicPageModule.forChild(FaleConoscoPage),
    FormsModule,
    SelectBoxComponentModule,
    DirectivesModule
  ],
  exports: [FaleConoscoPage]
})
export class FaleConoscoPageModule {}
