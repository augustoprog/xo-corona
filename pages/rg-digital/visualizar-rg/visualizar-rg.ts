import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";
import { RG } from "../../../providers/rg/rg.model";
import { RgProvider } from "../../../providers/rg/rg";
import { LoginPage } from "../../login/login";
import { AlertProvider } from "../../../providers/alert/alert";
import { HttpErrorResponse } from "@angular/common/http";
import { KeycloakService } from "../../../keycloak";
import { getErrorMessage } from "../../../util/common";


@IonicPage()
@Component({
  selector: "page-visualizar-rg",
  templateUrl: "visualizar-rg.html"
})
export class VisualizarRgPage {
  rg: RG;
  img: any;
  loader: Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public rgProvider: RgProvider,
    private alert: AlertProvider,
    private loadingController: LoadingController,
    private keycloakService: KeycloakService
  ) {
    this.rg = this.navParams.get("rg");
    let otp = this.rgProvider.updateOtp(this.rg).otp;
    this.present();
    this.rgProvider
      .visualizarRg({
        otp: otp
        // numeroRg: this.rg.numeroRg,
        // email: this.rg.email
      })
      .subscribe(
        data => {
          this.dismiss();

          var blob = new Blob([data.body], {
            type: "image/png"
          });

          //console.log(blob);

          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.img = reader.result;
            //console.log(reader);
          };
        },
        error => this.tratarErroServico(error)
      );
  }

  b64DecodeUnicode(str) {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), function(c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad VisualizarRgPage");
  }

  loaderCount: any[] = new Array();
  present() {
    if (this.loaderCount.length == 0) {
      this.loader = this.loadingController.create({
        content: "Carregando..."
      });
      this.loader.present();
    }
    this.loaderCount.push(true);
  }
  dismiss() {
    this.loaderCount.pop();
    if (this.loaderCount.length == 0) {
      this.loader.dismiss();
    }
  }

  private tratarErroServico(e: any, title?: string) {
    this.dismiss();
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
