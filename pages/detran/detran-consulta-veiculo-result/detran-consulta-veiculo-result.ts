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
  selector: "page-detran-consulta-veiculo-result",
  templateUrl: "detran-consulta-veiculo-result.html"
})
export class DetranConsultaVeiculoResultPage {
  public loader;

  public resultadoLicenciamento;
  public totalLicenciamento;
  public resultadoTaxas;
  public totalTaxas;
  public resultadoMultas;
  public totalMultas;

  public resultadoInfracoesSuspOrdemJudicial;
  public totalInfracoesSuspOrdemJudicial;

  public resultadoMultasRecursoSuspensivo;
  public totalMultasRecursoSuspensivo;

  public resultadoAtuacoesEmTramitacao;
  public totalAtuacoesEmTramitacao;

  public resultadoDebitoSuspOrdemJudicial;
  public totalDebitoSuspOrdemJudicial;

  uf;
  placa;
  chassi;
  marca_modelo;
  tipo;
  combustivel;
  ano_fab;
  ano_modelo;
  cilindrada;
  potencia;
  capacidade;
  tipoComb: any = [];
  categoria;
  cor;
  restricoes;
  DescRestricao1;
  DescRestricao2;
  DescRestricao3;
  DescRestricao4;
  DescRestricao5;
  placa_reflexiva;

  erro: boolean = false;

  public oCLRV: any = {};

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

    this.placa = navParams.get("placa");
    this.uf = navParams.get("uf");
    this.erro = true;

    detranProvider
      .getConsultaVeiculoDados(this.uf, this.placa)
      .finally(() => {
        this.loader.dismiss();
      })
      .subscribe(
        res => {
          if (res.ConsultaVeiculoDadosResult[0].MensagemErro) {
            this.erro = true;

            //return;
          } else {
            this.erro = false;
            this.oCLRV = res.ConsultaVeiculoDadosResult[0].oCLRV;
            //console.log(res.ConsultaVeiculoDadosResult[0].oDebitos);
            this.resultadoLicenciamento = res.ConsultaVeiculoDadosResult[0].oDebitos.filter(
              ({ GrupoDebito }) => GrupoDebito === "LICENCIAMENTO"
            );

            this.totalLicenciamento = this.resultadoLicenciamento.reduce(
              (sum, licenciamento) => {
                if (licenciamento.Totalizar === "U") {
                  return sum;
                }
                return (
                  sum + parseFloat(licenciamento.ValorReal.replace(",", "."))
                );
              },
              0
            );

            this.resultadoTaxas = res.ConsultaVeiculoDadosResult[0].oDebitos.filter(
              ({ GrupoDebito }) => GrupoDebito === "TAXAS DETRAN"
            );

            this.totalTaxas = this.resultadoTaxas.reduce(function (sum, taxa) {
              return sum + parseFloat(taxa.ValorReal.replace(",", "."));
            }, 0);

            this.resultadoMultas = res.ConsultaVeiculoDadosResult[0].oDebitos.filter(
              ({ GrupoDebito }) => GrupoDebito === "MULTAS"
            );

            this.totalMultas = this.resultadoMultas.reduce(function (
              sum,
              multa
            ) {
              return sum + parseFloat(multa.ValorReal.replace(",", "."));
            },
              0);

            this.resultadoInfracoesSuspOrdemJudicial = res.ConsultaVeiculoDadosResult[0].oDebitos.filter(
              ({ GrupoDebito }) =>
                GrupoDebito ===
                "INFRA\u00c7\u00d5ES SUSPENSAS POR ORDEM JUDICIAL"
            );

            this.totalInfracoesSuspOrdemJudicial = this.resultadoInfracoesSuspOrdemJudicial.reduce(
              function (sum, multa) {
                return sum + parseFloat(multa.ValorReal.replace(",", "."));
              },
              0
            );

            this.resultadoMultasRecursoSuspensivo = res.ConsultaVeiculoDadosResult[0].oDebitos.filter(
              ({ GrupoDebito }) =>
                GrupoDebito === "MULTAS COM RECURSO/SUSPENSIVO"
            );
            this.totalMultasRecursoSuspensivo = this.resultadoMultasRecursoSuspensivo.reduce(
              function (sum, multa) {
                return sum + parseFloat(multa.ValorReal.replace(",", "."));
              },
              0
            );

            this.resultadoAtuacoesEmTramitacao = res.ConsultaVeiculoDadosResult[0].oDebitos.filter(
              ({ GrupoDebito }) =>
                GrupoDebito === "AUTUA\u00c7\u00d5ES EM TRAMITA\u00c7\u00c3O"
            );
            this.totalAtuacoesEmTramitacao = this.resultadoAtuacoesEmTramitacao.reduce(
              function (sum, multa) {
                return sum + parseFloat(multa.ValorReal.replace(",", "."));
              },
              0
            );

            this.resultadoDebitoSuspOrdemJudicial = res.ConsultaVeiculoDadosResult[0].oDebitos.filter(
              ({ GrupoDebito }) =>
                GrupoDebito === "D\u00c9BITOS SUSPENSOS POR ORDEM JUDICIAL"
            );
            this.totalDebitoSuspOrdemJudicial = this.resultadoDebitoSuspOrdemJudicial.reduce(
              function (sum, multa) {
                return sum + parseFloat(multa.ValorReal.replace(",", "."));
              },
              0
            );

            ////console.log(res);
            //alert('Sucesso, Pontuação total: ' + res.ConsultarPontuacaoResult[0].pontuacaoTotal);

            this.chassi = res.ConsultaVeiculoDadosResult[0].sChassi;
            this.marca_modelo = res.ConsultaVeiculoDadosResult[0].sMarcaVeiculo;
            this.tipo = res.ConsultaVeiculoDadosResult[0].sTipoVeiculo;
            this.combustivel = res.ConsultaVeiculoDadosResult[0].sCombustivel;
            this.ano_fab = res.ConsultaVeiculoDadosResult[0].sAnoFabricacao;
            this.ano_modelo = res.ConsultaVeiculoDadosResult[0].sAnoModelo;
            this.cilindrada = res.ConsultaVeiculoDadosResult[0].sCilindrada;
            this.potencia = res.ConsultaVeiculoDadosResult[0].sPotencia;
            this.capacidade = res.ConsultaVeiculoDadosResult[0].sCapPassag;

            this.categoria =
              res.ConsultaVeiculoDadosResult[0].sCategoriaVeiculo;
            this.cor = res.ConsultaVeiculoDadosResult[0].sCorVeiculo;

            this.tipoCombustivel(this.combustivel);

            if (
              res.ConsultaVeiculoDadosResult[0].sNomeRestr1 == "" &&
              res.ConsultaVeiculoDadosResult[0].sNomeRestr2 == "" &&
              res.ConsultaVeiculoDadosResult[0].sNomeRestr3 == "" &&
              res.ConsultaVeiculoDadosResult[0].sNomeRestr4 == ""
            ) {
              this.restricoes = "Nada Consta";
            } else {
              this.restricoes = "";
              if (res.ConsultaVeiculoDadosResult[0].DescRestricao1 != "") {
                this.restricoes +=
                  res.ConsultaVeiculoDadosResult[0].sNomeRestr1 + "\n";
              }
              if (res.ConsultaVeiculoDadosResult[0].DescRestricao2 != "") {
                this.restricoes +=
                  res.ConsultaVeiculoDadosResult[0].sNomeRestr2 + "\n";
              }
              if (res.ConsultaVeiculoDadosResult[0].DescRestricao3 != "") {
                this.restricoes +=
                  res.ConsultaVeiculoDadosResult[0].sNomeRestr3 + "\n";
              }
              if (res.ConsultaVeiculoDadosResult[0].DescRestricao4 != "") {
                this.restricoes +=
                  res.ConsultaVeiculoDadosResult[0].sNomeRestr4 + "\n";
              }
            }
            this.placa_reflexiva =
              res.ConsultaVeiculoDadosResult[0].PlacaRefletiva;
          }
        },
        error => {
          this.erro = true;
        }
      );
  }

  tipoCombustivel(str) {
    this.tipoComb = str.split("/");
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad DetranConsultaVeiculoResult");
  }
}
