import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Loading
} from "ionic-angular";
import { AlertaCelularCadastroPage } from "./../alerta-celular-cadastro/alerta-celular-cadastro";
import { AlertaCelularProvider } from "../../providers/alerta-celular/alerta-celular";
import { AlertaCelularInformarPage } from "../alerta-celular-informar/alerta-celular-informar";
import { applyPhoneMask, getErrorMessage } from "../../util/common";
import { HttpErrorResponse } from "@angular/common/http";
import { AlertProvider } from "../../providers/alert/alert";
import { KeycloakService } from "../../keycloak";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: "page-menu-alerta-celular",
  templateUrl: "menu-alerta-celular.html"
})
export class MenuAlertaCelularPage {
  loader: Loading;
  meusAparelhos: any[];

  applyMask = applyPhoneMask;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertaProvider: AlertaCelularProvider,
    private alertCtrl: AlertController,
    private loadingController: LoadingController,
    private alert: AlertProvider,
    private keycloakService: KeycloakService
  ) { }

  editar(aparelho) {
    this.navCtrl.push(AlertaCelularCadastroPage, {
      id: aparelho.id
    });
  }

  ionViewWillEnter() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.alertaProvider.getAparelhos().subscribe(
      data => {
        this.loader.dismiss();
        this.meusAparelhos = data;
      },
      error => this.tratarErroServico(error)
    );
  }
  openPage() {
    this.navCtrl.push(AlertaCelularCadastroPage);
  }
  alertar(aparelho) {
    this.navCtrl.push(AlertaCelularInformarPage, {
      id: aparelho.id
    });
  }
  confirmDelete(aparelho) {
    let title =
      "<span class='alert-ico'><span class='mr-auto ml-auto col-3'><img src='assets/images/delete2.png' /></span></span>";
    let subTitle = "<span class='alert-title'>Remover celular?</span>";
    let msg =
      "<span class='alert-msg'>Esta operação não poderá ser desfeita.</br>Deseja continuar?</span>";
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      message: msg,
      cssClass: "custom-alert",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.loader = this.loadingController.create({
              content: "Carregando..."
            });
            this.loader.present();
            this.alertaProvider.deleteAparelho(aparelho).subscribe(
              data => {
                this.alertaProvider.getAparelhos().subscribe(
                  data => {
                    this.loader.dismiss();
                    //console.log(data);
                    this.meusAparelhos = data;
                  },
                  error => this.tratarErroServico(error)
                );
              },
              error => this.tratarErroServico(error)
            );
          }
        },
        {
          text: "Não",
          role: "cancel",
        }
      ]
    });
    alert.present();
  }

  private tratarErroServico(e: any, title?: string) {
    if(!!this.loader && !!this.loader.dismiss) {
      this.loader.dismiss();
    }
    if (e instanceof HttpErrorResponse && e.status == 403) {
      this.alert.showError({
        subTitle: title || "Atenção",
        msg: "A sua sessão expirou, favor efetue o login novamente.",
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.keycloakService.logout();
              this.navCtrl.setRoot(LoginPage);
            }
          }
        ]
      });
    } else {
      this.alert.showError({
        subTitle: title || "Erro!",
        msg: getErrorMessage(e),
        buttons: [{ text: "OK" }]
      });
    }
  }
  
}
