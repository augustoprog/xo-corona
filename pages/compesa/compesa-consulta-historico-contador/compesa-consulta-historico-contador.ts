import { CompesaConsultaHistoricoContadorResultPage } from "./../compesa-consulta-historico-contador-result/compesa-consulta-historico-contador-result";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams
} from "ionic-angular";
import { DatePipe } from "@angular/common";
import { isInvalidModel } from "../../../util/common";
import { AlertProvider } from "../../../providers/alert/alert";

@IonicPage()
@Component({
    selector: "page-compesa-consulta-historico-contador",
    templateUrl: "compesa-consulta-historico-contador.html"
})
export class CompesaConsultaHistoricoContadorPage {
    private matricula: string;
    private dataInicial: string;
    private dataFinal: string = (new Date()).toISOString();
    public isInvalidModel = isInvalidModel;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertProvider,
        private datePipe: DatePipe
    ) { }

    consultarHistorico(form) {
        if (form.invalid) {
            const messages: string[] = [];
            if (!!form.controls.matricula.errors && form.controls.matricula.errors['required']) {
                messages.push('Preencha a matrícula');
            } else if (!!form.controls.dataInicial.errors && form.controls.dataInicial.errors['required']) {
                messages.push('Preencha o mês inicial');
            } else if (!!form.controls.dataFinal.errors && form.controls.dataFinal.errors['required']) {
                messages.push('Preencha o mês final');
            }

            if (messages.length > 0) {
                this.alertCtrl.showError({
                    subTitle: "Atenção.",
                    msg: messages[0],
                    buttons: [{ text: "ok" }]
                });
            }
        } else {
            this.navCtrl.push(CompesaConsultaHistoricoContadorResultPage, {
                matricula: this.matricula,
                dataInicial: this.dataInicial.replace(/\D/g, ""),
                dataFinal: this.datePipe.transform(this.dataFinal, 'yyyyMM')
            });
        }
    }
}
