import { CompesaProvider } from "./../../../providers/compesa-provider";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-compesa-consulta-historico-contador-result",
  templateUrl: "compesa-consulta-historico-contador-result.html"
})
export class CompesaConsultaHistoricoContadorResultPage {
  public loader;
  private matricula: String = "";
  private dataInicial: String = "";
  private dataFinal: String = "";
  public resultado: any = "";
  results: boolean = true;

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
    public loadingController: LoadingController
  ) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();

    this.matricula = navParams.get("matricula");
    this.dataInicial = navParams.get("dataInicial");
    this.dataFinal = navParams.get("dataFinal");

    this.compesaProvider
      .getHistoricoPorContador(this.matricula, this.dataInicial, this.dataFinal)
      .subscribe(
        res => {
          if (res.retorno) {
            this.resultado = res.retorno;
          } else {
            this.results = false;
          }
          this.loader.dismiss();
        },
        error => {
          this.loader.dismiss();
          this.results = false;
        }
      );
  }

  getYear(faturamento: string) {
    if (faturamento) {
      return faturamento.slice(0, 4);
    }
  }

  getMonth(faturamento: string) {
    if (faturamento) {
      try {
        return this.month[parseInt(faturamento.slice(4)) - 1];
      } catch (error) {
        return "";
      }
    }
  }
}
