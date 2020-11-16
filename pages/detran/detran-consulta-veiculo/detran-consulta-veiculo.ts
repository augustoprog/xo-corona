import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
} from "ionic-angular";
import { DetranConsultaVeiculoResultPage } from "./../detran-consulta-veiculo-result/detran-consulta-veiculo-result";
import { NgForm } from "@angular/forms";
import { ufs } from "../../../util/common";
import { AlertProvider } from "../../../providers/alert/alert";
/**
 * Generated class for the DetranConsultaVeiculo page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-detran-consulta-veiculo",
  templateUrl: "detran-consulta-veiculo.html"
})
export class DetranConsultaVeiculoPage {
  placa: string;
  placaMask = [/[a-zA-Z]/, /[a-zA-Z]/, /[a-zA-Z]/, /\d/, /\d/, /\d/, /\d/];
  uf: string;
  ufs = ufs;

  @ViewChild("form") myForm: NgForm;

  constructor(public navCtrl: NavController,
    private alert: AlertProvider) {
    this.uf = "PE";
    this.placa = "";
  }

  consultarVeiculosDados(form: NgForm) {
    if (form.invalid) {
      const messages: string[] = [];
      if (!!form.controls.placa.errors && form.controls.placa.errors['required']) {
        messages.push('Preencha a placa');
      }
      if (messages.length > 0) {
        this.alert.showError({
          subTitle: "Atenção.",
          msg: messages[0],
          buttons: [{ text: "ok" }]
        });
      }
    } else {
      this.navCtrl.push(DetranConsultaVeiculoResultPage, {
        uf: this.uf,
        placa: this.placa.toUpperCase()
      });
    }
  }

  ionViewWillEnter() {
    this.myForm.resetForm();
    this.myForm.control.reset({ uf: "PE", placa: "" });
  }

  fixMask(mask: any[], text: string) {
    if (!!text && typeof text === 'string') {
      return text.substr(0, mask.length);
    }
    return text;
  }
}
