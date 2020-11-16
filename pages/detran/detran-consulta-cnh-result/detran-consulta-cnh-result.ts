import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";

import { DetranProvider } from "./../../../providers/detran-provider";

@IonicPage()
@Component({
  selector: "page-detran-consulta-cnh-result",
  templateUrl: "detran-consulta-cnh-result.html"
})
export class DetranConsultaCnhResultPage {
  error: boolean;
  loader;
  cpf;
  resultado;

  nome;
  registro;
  validade;
  pontuacaoTotal;
  pontuacoes: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    detranProvider: DetranProvider,
    public loadingController: LoadingController
  ) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();

    this.cpf = navParams.get("cpf");

    detranProvider
      .getConsultarPontuacao(this.cpf)
      .finally(() => {
        this.loader.dismiss();
      })
      .subscribe(
        res => {
          this.resultado = res;
          if (
            !res.ConsultarPontuacaoResult ||
            res.ConsultarPontuacaoResult.length == 0 ||
            res.ConsultarPontuacaoResult[0].cpf == "0"
          ) {
            this.error = true;
          } else {
            this.nome = res.ConsultarPontuacaoResult[0].sNome;
            this.registro = res.ConsultarPontuacaoResult[0].registro;
            this.validade = res.ConsultarPontuacaoResult[0].sValidadeCnh;
            this.pontuacaoTotal =
              res.ConsultarPontuacaoResult[0].pontuacaoTotal;

            this.pontuacoes = res.ConsultarPontuacaoResult[0].lstPontuacao;
          }
        },
        error => {
          this.error = true;
        }
      );
  }
}
