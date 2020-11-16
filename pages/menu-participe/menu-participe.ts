import { LoginPage } from "./../login/login";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  App
} from "ionic-angular";
import { ProfilePage } from "./../profile/profile";
import { FaleConoscoPage } from "../fale-conosco/fale-conosco";
import { OuvidoriaPage } from "../ouvidoria/ouvidoria";
import { environment } from "../../environment";

/**
 * Generated class for the MenuParticipe page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-menu-participe",
  templateUrl: "menu-participe.html"
})
export class MenuParticipePage {
  offline: boolean;
  checaRede;

  constructor(
    public _app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    //console.log("ionViewDidLoad MenuParticipe");
  }

  ionViewWillEnter() {
    //console.log("ionViewWillEnter MenuParticipe");
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

  goToFaleconosco() {
    this.navCtrl.push(FaleConoscoPage);
  }

  goToOuvidoria() {
    this.navCtrl.push(OuvidoriaPage);
  }

  goToParticipe() {
    window.open(environment.participaUrl, '_blank');
  }
}
