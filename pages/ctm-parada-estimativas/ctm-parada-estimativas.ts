import {
    CtmProvider,
    Parada,
    Estimativa,
    LinhaDetalhe
} from "./../../providers/ctm-provider";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/finally";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController
} from "ionic-angular";

@IonicPage()
@Component({
    selector: "page-ctm-parada-estimativas",
    templateUrl: "ctm-parada-estimativas.html"
})
export class CtmParadaEstimativasPage {
    public loaderHorarios;
    public loaderDetalhesLinhas;

    linhasDaParada: string[] = [];
    linhasDetalhes: LinhaDetalhe[] = [];
    mapLinhaIdLabel: Map<number, string> = new Map<number, string>();

    parada: Parada;
    estimativas: Estimativa[] = [];
    error: boolean = false;
    error2: boolean = false;

    paradaFavorita: boolean;
    minhasParadasFavoritas: Parada[] = [];

    visualizarInfoParada = null;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private ctmProvider: CtmProvider,
        public loadingController: LoadingController
    ) {
        this.loaderHorarios = this.loadingController.create({
            content: "Carregando..."
        });
        this.loaderHorarios.present();
    }

    ionViewDidLoad() {
        this.parada = this.navParams.get("parada");
        this.ctmProvider
            .getEstimativasParada(this.parada.label)
            .flatMap((estimativas: Estimativa[]) => {
                this.estimativas = estimativas
                    .sort((a, b) => a.arrivalTime.getTime() < b.arrivalTime.getTime() ? -1 : 1);

                if (!this.estimativas.length) {
                    this.error = true;
                } else {
                    this.visualizarInfoParada = "horarios";
                }

                return this.ctmProvider.getLinhasDaParada(this.parada.label);
            })
            .flatMap((linhas: string[]) => {
                this.linhasDaParada = linhas;

                return this.ctmProvider.getLinhas();
            })
            .finally(() => {
                this.loaderHorarios.dismiss();
            })
            .subscribe(
                (linhas: LinhaDetalhe[]) => {
                    this.linhasDetalhes = linhas;
                    if (!this.linhasDetalhes.length) {
                        this.error2 = true;
                    } else {
                        this.visualizarInfoParada = this.visualizarInfoParada || "linhas";
                    }
                    this.linhasDetalhes = this.linhasDetalhes
                        .filter((linha: LinhaDetalhe) =>
                            linha.nombre.indexOf("EXTINTA") == -1 &&
                            this.linhasDaParada.indexOf(linha.label) > -1
                        );

                    this.linhasDetalhes
                        .forEach((linha: LinhaDetalhe) => this.mapLinhaIdLabel.set(linha.id, linha.label));

                    this.linhasDetalhes
                        .sort((a, b) => a.nombre.trim() < b.nombre.trim() ? -1 : 1);
                },
                error => {
                    this.error2 = true;
                    this.error = true;
                }
            );
    }

    getLabelLinha(id: number): string {
        return this.mapLinhaIdLabel.get(id);
    }

    checaParadaFavorita(p) {
        const favoritas = window.localStorage.getItem("MinhasParadasFavoritas");
        let retorno = false;
        if (!!favoritas) {
            try {
                this.minhasParadasFavoritas = JSON.parse(favoritas);
                this.minhasParadasFavoritas.filter(item => {
                    if (item.label === p.label) {
                        retorno = true;
                    }
                });
            } catch { }
        }

        return retorno;
    }

    addParadaFavorita(parada: Parada) {
        if (!this.checaParadaFavorita(parada)) {
            this.minhasParadasFavoritas.push(parada);
            window.localStorage.setItem(
                "MinhasParadasFavoritas",
                JSON.stringify(this.minhasParadasFavoritas)
            );
        }
    }

    removeParadaFavorita(parada: Parada) {
        if (this.checaParadaFavorita(parada)) {
            this.minhasParadasFavoritas = this.minhasParadasFavoritas
                .filter(item => item.label != parada.label);
            window.localStorage.setItem(
                "MinhasParadasFavoritas",
                JSON.stringify(this.minhasParadasFavoritas)
            );
        }
    }

    get enderecoParada(): string {
        if (this.parada && this.parada.endereco) {
            let end = this.parada.endereco.replace(new RegExp('undefined', 'g'), '')
                .replace(/,[\W|\s]{2,}/g, '');
            return end;
        }
        return '';
    }
}
