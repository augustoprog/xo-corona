import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";
import { isInvalidModel, getErrorMessage } from "../../../util/common";
import { ChaveSegurancaPage } from "../chave-seguranca/chave-seguranca";
import { AlertProvider } from "../../../providers/alert/alert";
import { RgProvider } from "../../../providers/rg/rg";
import { RG } from "../../../providers/rg/rg.model";
import { LoginPage } from "../../login/login";
import { KeycloakService } from "../../../keycloak";
import { HttpErrorResponse } from "@angular/common/http";

/**
 * Generated class for the PinSegurancaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pin-seguranca",
  templateUrl: "pin-seguranca.html"
})
export class PinSegurancaPage {
  pin: string;
  pinConf: string;
  isInvalidModel = isInvalidModel;
  cidadaoLogado: any;

  rg: RG;

  public pinMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  loader: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alert: AlertProvider,
    private rgProvider: RgProvider,
    private loadingController: LoadingController,
    private keycloakService: KeycloakService
  ) {
    this.rg = this.navParams.get("rg");
  }

  ionViewDidLoad() {
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => this.cidadaoLogado = cidadao);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.pin != this.pinConf) {
        this.alert.showError({
          subTitle: "Atenção.",
          msg: "O campo de confirmação de PIN não confere.",
          buttons: [{ text: "ok" }]
        });
      } else if (this.pin.length != 6) {
        this.alert.showError({
          subTitle: "Atenção.",
          msg: "O código PIN deve conter 6 dígitos.",
          buttons: [{ text: "ok" }]
        });
      } else {
        let otp = this.rgProvider.updateOtp(this.rg).otp;
        this.present();
        this.rgProvider
          .ativarToken({
            otp: otp
            // numeroRg: this.rg.numeroRg,
            // email: this.rg.email
          })
          .subscribe(
            data => {
              this.dismiss();
              let hashed = this.rgProvider.encrypt(this.pin, this.rg);

              this.rgProvider
                .save({
                  email: this.cidadaoLogado.email,
                  rg: { numero: this.rg.numeroFicha },
                  obj: hashed
                })
                .subscribe(saved => {
                  if (saved) {
                    this.navCtrl
                      .push(ChaveSegurancaPage, { rg: this.rg })
                      .then(() => {
                        this.navCtrl.remove(this.navCtrl.getPrevious().index);
                      });
                  } else {
                    this.alert.showError({
                      subTitle: "Atenção.",
                      msg: "Não é possível cadastrar o mesmo RG mais de uma vez.",
                      buttons: [
                        {
                          text: "ok",
                          handler: () => {
                            this.navCtrl.pop();
                          }
                        }
                      ]
                    });
                  }
                },
                error => this.tratarErroServico(error));
            },
            error => this.tratarErroServico(error)
          );
      }
    }

    //console.log(form);
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

  // var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase", { format: JsonFormatter }); alert(encrypted); // {"ct":"tZ4MsEnfbcDOwqau68aOrQ==","iv":"8a8c8fd8fe33743d3638737ea4a00698","s":"ba06373c8f57179c"}
  // var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase", { format: JsonFormatter }); alert(decrypted.toString(CryptoJS.enc.Utf8)); // Message

  hidePassword(el: HTMLInputElement) {
    el.classList.add("password");
  }
  showPassword(el: HTMLInputElement) {
    el.classList.remove("password");
  }

  cancelar() {
    this.navCtrl.pop();
  }

  fixMask(mask: any[], text: string) {
    if(!!text && typeof text === 'string') {
      return text.substr(0, mask.length);
    }
    return text;
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
