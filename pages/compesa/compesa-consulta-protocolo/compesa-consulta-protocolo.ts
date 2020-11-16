import { CompesaProvider } from "./../../../providers/compesa-provider";
import { Component } from "@angular/core";
import {
  IonicPage,
  LoadingController,
  Loading
} from "ionic-angular";
import "rxjs/add/operator/finally";
import { NgForm } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-compesa-consulta-protocolo",
  templateUrl: "compesa-consulta-protocolo.html"
})
export class CompesaConsultaProtocoloPage {
  static ERROR_MSG: string = "Não foi possível encontrar seu protocolo.";

  loader: Loading;
  protocolo: string;
  status: string;

  constructor(
    private loadingController: LoadingController,
    private compesaProvider: CompesaProvider
  ) {}

  consultarProtocolo(form: NgForm) {
    if (form.valid) {
      this.status = null;
      this.loader = this.loadingController.create({
        content: "Carregando..."
      });
      this.loader.present();
      this.compesaProvider
        .getStatusReportagem(this.protocolo)
        .finally(() => {
          this.loader.dismiss();
        })
        .subscribe(
          res => {
            if (res.sucesso && res.retorno[0].nil !== "true") {
              this.status = res.retorno[0].$;
            } else {
              this.status = CompesaConsultaProtocoloPage.ERROR_MSG;
            }
          },
          _ => {
            this.status = CompesaConsultaProtocoloPage.ERROR_MSG;
          }
        );
    }
  }
}
