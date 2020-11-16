import { CompesaConsultaProtocoloPage } from './../compesa/compesa-consulta-protocolo/compesa-consulta-protocolo';
import { CompesaConsultaLojasPorMunicipioPage } from './../compesa/compesa-consulta-lojas-por-municipio/compesa-consulta-lojas-por-municipio';
import { CompesaConsultaHistoricoContadorPage } from './../compesa/compesa-consulta-historico-contador/compesa-consulta-historico-contador';
import { CompesaConsultaDebitoPage } from './../compesa/compesa-consulta-debito/compesa-consulta-debito';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MenuCompesa page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-menu-compesa',
  templateUrl: 'menu-compesa.html',
})
export class MenuCompesaPage {
  search: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad MenuCompesa');
  }

  items: { name: string; page: any }[] = [
    { name: "Consulta Débitos", page: CompesaConsultaDebitoPage },
    { name: "Consulta Histórico de Consumo", page: CompesaConsultaHistoricoContadorPage },
    { name: "Consulta Lojas Por Município", page: CompesaConsultaLojasPorMunicipioPage },
    { name: "Consulta Protocolo", page: CompesaConsultaProtocoloPage }
  ];

}
