import { Component } from "@angular/core";
import {
  AlertController,
  App,
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { KeycloakService } from "../../keycloak";
import { AppConfigProvider } from "../../providers/app-config/app-config";
import { AgendamentoConsultaPage } from "../agendamento/agendamento-consulta/agendamento-consulta";
import { MenuServicosDestaquePage } from "../carta-servico/menu-servicos-destaque/menu-servicos-destaque";
import { MenuAgendamentoPage } from "../menu-agendamento/menu-agendamento";
import { MenuRgDigitalPage } from "../menu-rg-digital/menu-rg-digital";
import { MenuOrgaosCartaPage } from "./../carta-servico/menu-orgaos-carta/menu-orgaos-carta";
import { LoginPage } from "./../login/login";
import { MenuAlertaCelularPage } from "./../menu-alerta-celular/menu-alerta-celular";
import { MenuCompesaPage } from "./../menu-compesa/menu-compesa";
import { MenuCtmPage } from "./../menu-ctm/menu-ctm";
import { MenuServicoDetranPage } from "./../menu-servico-detran/menu-servico-detran";
import { ProfilePage } from "./../profile/profile";
import { MenuCovid19Page } from "../menu-covid19/menu-covid19";
import { SefazNfePage } from "../sefaz-nfe/sefaz-nfe";
import { ComprePEPage } from "../compre-pe/compre-pe";

@IonicPage()
@Component({
  selector: "page-menu-servico",
  templateUrl: "menu-servico.html"
})
export class MenuServicoPage {
  offline: boolean;
  checaRede;
  items;

  constructor(
    public _app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public menuServicoProvider: AppConfigProvider,
    private keycloakService: KeycloakService
  ) {
    this.initializeItems();
  }

  isLogged(): boolean {
    return this.keycloakService.isAuthenticated();
  }

  initializeItems() {
    this.items = this.menuServicoProvider.itensMenuServico.filter(
      item => item.enabled
    );
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      //let filtro = val.toLowerCase();
      this.items = this.items.filter(item => {
        return item.titulo.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad MenuServico");
  }

  navProfile() {
    let title =
      "<span class='alert-ico'><span class='mr-auto ml-auto'><img src='assets/images/warning.png' /></span></span>";
    let subTitle = "<span class='alert-title'>Acesso Anônimo</span>";
    let msg =
      "<span class='alert-msg'>Você está usando o App no modo anônimo por isso não tem acesso a esta funcionalidade. Deseja fazer login e ter acesso completo?</span>";

    if (window.localStorage.getItem("tipoAcesso") == "anonimo") {
      const alert = this.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        message: msg,
        cssClass: "custom-alert",
        buttons: [
          {
            text: "Sim",
            handler: () => {
              this.navCtrl.setRoot(LoginPage);
            }
          },
          {
            text: "Não",
            role: "cancel",
            handler: () => {
              //console.log("Não clicked");
            }
          }
        ]
      });
      alert.present();
    } else {
      this.navCtrl.push(ProfilePage);
    }
  }

  openPage(pagina) {
    let paginaDestino: any;

    if (pagina == "MenuServicosDestaquePage") {
      paginaDestino = MenuServicosDestaquePage;
      this._app.getRootNav().push(paginaDestino);
    } else if (pagina == "MenuOrgaosCartaPage") {
      this._app.getRootNav().push(MenuOrgaosCartaPage);
    } else if (pagina == "MenuCompesaPage") {
      this._app.getRootNav().push(MenuCompesaPage);
    } else if (pagina == "MenuServicoDetranPage") {
      this._app.getRootNav().push(MenuServicoDetranPage);
    } else if (pagina == "MenuCtmPage") {
      this._app.getRootNav().push(MenuCtmPage);
    } else if (pagina == "MenuRgDigitalPage") {
      this._app.getRootNav().push(MenuRgDigitalPage);
    } else if (pagina == "MenuAlertaCelularPage") {
      this._app.getRootNav().push(MenuAlertaCelularPage);
    } else if (pagina == "MenuCovid19Page") {
      this._app.getRootNav().push(MenuCovid19Page);
    } else if (pagina == "SefazNfePage") {
        this._app.getRootNav().push(SefazNfePage);
    } else if (pagina == "ComprePEPage") {
        this._app.getRootNav().push(ComprePEPage);
    }    else {
      let openPageAgendamento = localStorage.getItem("dados-cidadao-logado")
        ? MenuAgendamentoPage
        : AgendamentoConsultaPage;
      this._app.getRootNav().push(openPageAgendamento);
    }
  }

  showToast(position: string) {
    let toast = this.toastCtrl.create({
      message: "Ainda não implementado.",
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  ionViewWillEnter() {
    if (this.isLogged()) {
      this.items.forEach(element => {
        element.fl_ativo = true;
      });
    }
  }

  ionViewWillLeave() {
    clearInterval(this.checaRede);
  }
}
