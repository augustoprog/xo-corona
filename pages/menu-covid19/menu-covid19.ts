import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { KeycloakService } from '../../keycloak';

import { Covid19DycovidPage } from '../covid19-dycovid/covid19-dycovid';
import { Covid19AtendeEmCasaInfoPage } from '../covid19-atende-em-casa-info/covid19-atende-em-casa-info';
import { Covid19AnjoAmigoInfoPage } from '../covid19-anjo-amigo-info/covid19-anjo-amigo-info';

/**
 * Generated class for the MenuCovid19Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu-covid19',
  templateUrl: 'menu-covid19.html',
})
export class MenuCovid19Page {

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
            logo: "atende-em-casa.svg",
            titulo: "Atende em Casa",
            descricao: "Portal",
            tipo: "page",
            url: "AtendeEmCasaPage",
            fl_ativo: true
        },
        {
            logo: "anjo-amigo.svg",
            titulo: "Anjo amigo",
            descricao: "Portal",
            tipo: "page",
            url: "AnjoAmigoPage",
            fl_ativo: true
        },
        
        {
            logo: "dycovid.svg",
            titulo: "Dycovid",
            descricao: "App - Dynamic Contact Tracing",
            tipo: "page",
            url: "DycovidPage",
            fl_ativo: true
        },
    ];
  }

  openPage(pagina) {
    let paginaDestino: any;

    if (pagina == "AtendeEmCasaPage") {
        paginaDestino = Covid19AtendeEmCasaInfoPage;
        this._app.getRootNav().push(paginaDestino);
    } else if (pagina == "AnjoAmigoPage") {
        this._app.getRootNav().push(Covid19AnjoAmigoInfoPage);
    }  else if (pagina == "DycovidPage") {
        this._app.getRootNav().push(Covid19DycovidPage);
    }
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuCovid19Page');
  }

}
