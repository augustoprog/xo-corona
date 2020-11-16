import { LoginPage } from "./../login/login";
import { ExpressoAntesDeIrPage } from "./../expresso-antes-de-ir/expresso-antes-de-ir";
import { GovernoNoMapaPage } from "./../governo-no-mapa/governo-no-mapa";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  App
} from "ionic-angular";
import { ProfilePage } from "./../profile/profile";
import { ToastController } from "ionic-angular";
import { NotificacoesCidadaoPage } from "../notificacoes-cidadao/notificacoes-cidadao";
import { environment } from "../../environment";

@IonicPage()
@Component({
  selector: "page-menu-informacao",
  templateUrl: "menu-informacao.html"
})
export class MenuInformacaoPage {
  offline: boolean;
  checaRede;
  exibeNotifica = environment.exibeNotifica;

  constructor(
    public _app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) { }

  openModal() {
    let myModal = this.modalCtrl.create(GovernoNoMapaPage);
    myModal.present();
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad MenuInformacao");
  }

  openPage(pagina) {
    let paginaDestino: any;

    if (pagina == "GovernoNoMapaPage") {
      paginaDestino = GovernoNoMapaPage;
      this.openModal();
      //}
    } else if (pagina == "ExpressoAntesDeIrPage") {
      paginaDestino = ExpressoAntesDeIrPage;
      //this.navCtrl.push(paginaDestino);
      this._app.getRootNav().push(paginaDestino);
      //this.openModal();
    } else if (pagina == "NoticiasPage") {
      paginaDestino = NotificacoesCidadaoPage;
      //this._app.getRootNav().push(paginaDestino);
      this.navCtrl.push(paginaDestino);
    } else {
      this.showToast("middle");
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
    //console.log("ionViewWillEnter MenuInformacao");

    // this.offline = (window.localStorage.getItem('offline') == 'true');
    // this.checaRede = setInterval(() => {

    //   this.offline = !(window.localStorage.getItem('offline') == 'false');

    // }, 15000);
  }

  navProfile() {
    if (window.localStorage.getItem("tipoAcesso") == "anonimo") {
      const alert = this.alertCtrl.create({
        title: "Acesso Anônimo",
        message:
          "Você está usando o App no modo anônimo por isso não tem acesso a esta funcionalidade. Deseja fazer login e ter acesso completo?",
        buttons: [
          {
            text: "Não",
            role: "cancel"
          },
          {
            text: "Sim",
            handler: () => {
              this.navCtrl.setRoot(LoginPage);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.navCtrl.push(ProfilePage);
    }
  }

  ionViewWillLeave() {
    clearInterval(this.checaRede);
  }
}
