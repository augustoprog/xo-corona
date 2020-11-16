import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";
import { isInvalidModel } from "../../../util/common";
import { ChaveSegurancaPage } from "../chave-seguranca/chave-seguranca";
import { AlertProvider } from "../../../providers/alert/alert";
import { RgProvider } from "../../../providers/rg/rg";
import { RG } from "../../../providers/rg/rg.model";

/**
 * Generated class for the PinDesbloquearPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pin-desbloquear",
  templateUrl: "pin-desbloquear.html"
})
export class PinDesbloquearPage {
  pin: string;
  pinConf: string;
  isInvalidModel = isInvalidModel;

  rg: RG;
  type: string;
  loader: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alert: AlertProvider,
    private rgProvider: RgProvider,
    private loadingController: LoadingController
  ) {
    this.rg = this.navParams.get("rg");
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad PinSegurancaPage");
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      if (this.pin.length != 6) {
        this.alert.showError({
          subTitle: "Atenção.",
          msg: "O código PIN deve conter 6 digitos.",
          buttons: [{ text: "ok" }]
        });
      } else {
        try {
          let obj = this.rgProvider.decrypt(this.pin, this.rg);
          let rg = JSON.parse(obj);
          this.navCtrl.push(ChaveSegurancaPage, { rg: rg }).then(() => {
            this.navCtrl.remove(this.navCtrl.getPrevious().index);
          });
        } catch (error) {
          this.alert.showError({
            subTitle: "Atenção.",
            msg: "O código PIN incorreto.",
            buttons: [{ text: "ok" }]
          });
        }
      }
    }

    //console.log(form);
  }
  // var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase", { format: JsonFormatter }); alert(encrypted); // {"ct":"tZ4MsEnfbcDOwqau68aOrQ==","iv":"8a8c8fd8fe33743d3638737ea4a00698","s":"ba06373c8f57179c"}
  // var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase", { format: JsonFormatter }); alert(decrypted.toString(CryptoJS.enc.Utf8)); // Message

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

  hidePassword(el: HTMLInputElement) {
    el.classList.add("password");
  }
  showPassword(el: HTMLInputElement) {
    el.classList.remove("password");
  }

  cancelar() {
    this.navCtrl.pop();
  }
}
