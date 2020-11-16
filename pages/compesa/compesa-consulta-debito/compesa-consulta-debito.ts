import { CompesaConsultaDebitoResultPage } from './../compesa-consulta-debito-result/compesa-consulta-debito-result';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-compesa-consulta-debito',
  templateUrl: 'compesa-consulta-debito.html',
})
export class CompesaConsultaDebitoPage {

  private matricula = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    ////console.log('ionViewDidLoad CompesaConsultaDebito');
  }

  consultarDebitos(form) {
    if (form.valid) {
      this.navCtrl.push(CompesaConsultaDebitoResultPage, {
        "matricula": this.matricula
      });
    }
  }
}
