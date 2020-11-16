import { IonicPage, NavController } from "ionic-angular";
import { Component } from "@angular/core";
import { CadastrarPage } from "../cadastrar/cadastrar";

@IonicPage()
@Component({
    selector: "page-info-cadastrar",
    templateUrl: "info-cadastrar.html"
})
export class InfoCadastrarPage {

    public noShowAgain: boolean = false;

    constructor(private navCtrl: NavController) { }

    public next() {
        window.localStorage.setItem('no-show-info-cadastro', JSON.stringify(this.noShowAgain));
        this.navCtrl.setRoot(CadastrarPage);
    }

}