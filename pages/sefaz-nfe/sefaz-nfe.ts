import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { KeycloakService } from '../../keycloak';
import { SefazNfeConsultaPage } from '../sefaz-nfe-consulta/sefaz-nfe-consulta';

/**
 * Generated class for the SefazNfePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sefaz-nfe',
  templateUrl: 'sefaz-nfe.html',
})
export class SefazNfePage {

  public items: any[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private keycloakService: KeycloakService, 
              public _app: App) {
    this.initializeItems();
        if (this.isLogged()) {
            this.items.forEach(element => {
                element.fl_ativo = true;
                //element.fl_ativo = element.fl_ativo;
            });
        }
  }

  isLogged(): boolean {
    return this.keycloakService.isAuthenticated();
  }

  initializeItems() {
    this.items = [
        {
            logo: "nfe.svg",
            titulo: "Consulta NFE",
            descricao: "Nota fiscal Eletrônica",
            tipo: "page",
            url: "SefazNfeConsultaPage",
            fl_ativo: true,
            logo2: "Protocolo.png",
            titulo2: "Consulta Protocolos",
            descricao2: "Protocolo",
            tipo2: "page",
           
            fl_ativo2: true,
        },
    ];
  }

  openPage(pagina) {
    let paginaDestino: any;

    if (pagina == "SefazNfeConsultaPage") {
        paginaDestino = SefazNfeConsultaPage;
        this._app.getRootNav().push(paginaDestino);
    }
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SefazNfePage');
  }

}
