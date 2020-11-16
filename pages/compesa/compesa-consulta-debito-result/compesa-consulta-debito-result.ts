import { CompesaProvider } from "./../../../providers/compesa-provider";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import "rxjs/add/operator/finally";
declare const cordova;

/**
 * Generated class for the CompesaConsultaDebitoResult page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-compesa-consulta-debito-result",
  templateUrl: "compesa-consulta-debito-result.html"
})
export class CompesaConsultaDebitoResultPage {
  private matricula: String = "";
  private resultado: any = null;
  error: boolean = false;
  total = 0;
  loader;
  month = [
    "JAN",
    "FEB",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AUG",
    "SET",
    "OUT",
    "NOV",
    "DEZ"
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private compesaProvider: CompesaProvider,
    public toastCtrl: ToastController,
    public loadingController: LoadingController
  ) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();

    this.matricula = navParams.get("matricula");

    this.compesaProvider
      .getConsultaDebitos(this.matricula)
      .finally(() => {
        this.loader.dismiss();
      })
      .subscribe(
        res => {
          if (res.mensagem != "Imóvel sem débitos" && res.sucesso == true) {
            this.resultado = res.retorno;
            for (let item of this.resultado) {
              this.total = this.total + parseFloat(item.valor);
            }
          } else {
            this.error = true;
            this.total = 0;
          }
        },
        error => {
          this.error = true;
        }
      );
  }

  ionViewDidLoad() {}

  getMonth(text: String) {
    if (text) {
      try {
        let textMonth = text.split("/")[0];
        return this.month[parseInt(textMonth) - 1];
      } catch (e) {
        return "";
      }
    }
  }
  getYear(text: String) {
    if (text) {
      try {
        let textMonth = text.split("/")[1];
        return textMonth;
      } catch (e) {
        return "";
      }
    }
  }

  copyBarCode(text) {
    if (cordova) {
      cordova.plugins.clipboard.copy(text);
      let toast = this.toastCtrl.create({
        message: "Copiado com sucesso!",
        duration: 2000,
        position: "middle"
      });
      toast.present(toast);
    }
  }
}
