import {
    CtmProvider,
    Linha,
    Parada,
    Local,
} from "./../../providers/ctm-provider";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    Loading
} from "ionic-angular";
import { ViewController } from "ionic-angular";
import { AlertController } from "ionic-angular";
import "rxjs/add/observable/interval";
import { OSMLocal } from "../../providers/open-street-map/open-street-map";
import { LatLng, latLng } from "leaflet";
import { AlertProvider } from "../../providers/alert/alert";

@IonicPage()
@Component({
    selector: "page-ctm-linha-itinerario",
    templateUrl: "ctm-linha-itinerario.html"
})
export class CtmLinhaItinerarioPage {
    pontos: OSMLocal[];
    caminhos: LatLng[][];
    error: boolean = false;
    public loader: Loading;
    stopIndex = 0;
    linha: string;

    private static STOP_MARGIN: number = 0.00093124;

    constructor(
        private ctmProvider: CtmProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public viewCtrl: ViewController,
        public loadingController: LoadingController,
        private alert: AlertProvider
    ) { }

    ionViewDidLoad() {
        const idLinha = this.navParams.get("id");
        this.linha = this.navParams.get("linha");
        this.loader = this.loadingController.create({
            content: "Carregando..."
        });
        this.loader.present();
        this.ctmProvider
            .getLinha(idLinha)
            .finally(() => {
                this.loader.dismiss();
            })
            .subscribe((linha: Linha) => {
                this.caminhos = linha.polylines
                    .map((pontos: Local[]) => pontos
                        .map((ponto: Local) => latLng(ponto.lat, ponto.lon)))
                if (linha.stops.length > 0) {
                    this.pontos = linha.stops
                        .map((parada: Parada) => {
                            const ponto = new OSMLocal(parada.location.lat, parada.location.lon);
                            ponto.displayName = `Parada: ${parada.name}`;
                            ponto.boundingbox = [
                                parada.location.lat + CtmLinhaItinerarioPage.STOP_MARGIN,
                                parada.location.lat - CtmLinhaItinerarioPage.STOP_MARGIN,
                                parada.location.lon + CtmLinhaItinerarioPage.STOP_MARGIN,
                                parada.location.lon - CtmLinhaItinerarioPage.STOP_MARGIN
                            ];
                            return ponto;
                        });
                } else {                    
                    this.alert.showInfo({
                        subTitle: 'Informação',
                        msg: 'Nenhuma informação encontrada',
                        buttons: [{
                            text: "OK",
                            handler: () => {
                                this.navCtrl.pop();
                            }
                        }],
                    });
                }
            }, () => {
                this.alert.showError({
                    subTitle: 'Erro',
                    msg: 'Erro ao tentar obter as informações da linha',
                    buttons: [{
                        text: "OK",
                        handler: () => {
                            this.navCtrl.pop();
                        }
                    }]
                });
            });
    }

    ionViewWillLeave() {
        if(!!this.loader && this.loader.dismiss) {
            this.loader.dismiss();
        }
    }
}
