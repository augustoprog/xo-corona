import { DetranConsultaCnhResultPage } from "./../detran-consulta-cnh-result/detran-consulta-cnh-result";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import { AlertProvider } from "../../../providers/alert/alert";

/**
 * Generated class for the DetranConsultaCnh page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: "page-detran-consulta-cnh",
    templateUrl: "detran-consulta-cnh.html"
})
export class DetranConsultaCnhPage {
    //026.843.934-60
    cpf = "";
    mask = [
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        ".",
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        ".",
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        "-",
        /[0-9]/,
        /[0-9]/
    ];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private alert: AlertProvider,
    ) { }

    consultarPontosCnh(form) {
        if (form.invalid) {
            if (!!form.controls.cpf.errors) {
                const messages: string[] = [];
                if (form.controls.cpf.errors['required']) {
                    messages.push('Preencha o CPF');
                } else if (!form.controls.cpf.errors['cpf']) {
                    messages.push('CPF inválido');
                }
                if (messages.length > 0) {
                    this.alert.showError({
                        subTitle: "Atenção.",
                        msg: messages[0],
                        buttons: [{ text: "ok" }]
                    });
                }
            }
            return;
        }

        this.navCtrl.push(DetranConsultaCnhResultPage, {
            cpf: this.cpf.replace(/\D/g, "") // replace all leading non-digits with nothing
        });
    }

    fixMask(mask: any[], text: string) {
        if (!!text && typeof text === 'string') {
            return text.substr(0, mask.length);
        }
        return text;
    }
}
