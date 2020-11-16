import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { LoginPage } from "./login";
import { FormsModule } from "@angular/forms";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [LoginPage],
  imports: [
    IonicPageModule.forChild(LoginPage),
    FormsModule,
    DirectivesModule
  ],
  exports: [LoginPage]
})
export class LoginModule {}
