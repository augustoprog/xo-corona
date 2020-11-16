import { CtmParadaEstimativasPage } from "./../ctm-parada-estimativas/ctm-parada-estimativas";
import {
    CtmProvider,
    Parada,
    Linha,
} from "./../../providers/ctm-provider";
import { Component, ChangeDetectorRef } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    Loading
} from "ionic-angular";
import { Diagnostic } from '@ionic-native/diagnostic';
import {
    Geolocation,
    Geoposition,
} from "@ionic-native/geolocation";
import { ViewController } from "ionic-angular";
import { AlertController } from "ionic-angular";
import { AcaoLocal, Acao } from "../carta-servico/servico-mapa/servico-mapa";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/do";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/merge";
import {
    OSMLocal,
    OpenStreetMapProvider,
    OSMEndereco,
} from "../../providers/open-street-map/open-street-map";
import { LatLng, latLng } from "leaflet";
import { AlertProvider } from "../../providers/alert/alert";
import { getErrorMessage } from "../../util/common";

@IonicPage()
@Component({
    selector: "page-ctm-mapa-paradas",
    templateUrl: "ctm-mapa-paradas.html"
})
export class CtmMapaParadasPage {

    static PREFIXO_PARADA: string = 'Parada ';
    static MAX_RAIO_PARADAS: number = 1000;
    loader: Loading;

    mapParadas: Map<string, Parada> = new Map<string, Parada>();
    mapParadasPlotadas: Map<string, boolean> = new Map<string, boolean>();
    locaisParadas: OSMLocal[];
    raioParadas: number = 300;
    acoes: Acao[] = [{
        nome: 'Mais informações',
        icone: 'ion-plus-round'
    }];
    localAtual: OSMLocal;
    centroAtual: LatLng;

    carregando: boolean = false;
    temConexao: boolean = false;

    constructor(
        private ctmProvider: CtmProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public viewCtrl: ViewController,
        private alert: AlertProvider,
        private geolocation: Geolocation,
        private diagnostic: Diagnostic,
        private changeDetector: ChangeDetectorRef,
        private loadingController: LoadingController,
        private osm: OpenStreetMapProvider,
    ) { }

    ionViewDidLoad() {
        this.loader = this.loadingController.create({
            content: "Carregando..."
        });       
        this.loader.present();        
        this.diagnostic.isLocationEnabled()
            .then((isEnabled: boolean) => {
                if (isEnabled) {
                    return this.geolocation.getCurrentPosition();
                } else {
                    this.alert.showError({
                        subTitle: 'Localização desabilitada',
                        msg: 'Por favor, ative a localização de GPS do seu dispositivo.',
                        buttons: [{
                            text: 'Ok',
                            handler: () => {
                                this.navCtrl.pop();
                            },
                        }]
                    });
                }

                return Promise.resolve(null);
            })
            .then((position: Geoposition) => {
                if(!!position) {    
                    this.localAtual = new OSMLocal(position.coords.latitude, position.coords.longitude);
                    this.centroAtual = latLng(position.coords.latitude, position.coords.longitude);
                    this.carregarParadas(position.coords.latitude, position.coords.longitude, this.raioParadas)
                        .catch(error => {
                            this.alert.showError({
                                subTitle: 'Erro!',
                                msg: error.status === 0 ? 'Sem conexão com a internet' : getErrorMessage(error),
                                buttons: [{
                                    text: 'OK',
                                    handler: () => {
                                        this.navCtrl.pop();
                                    }
                                }]
                            });

                            return Observable.of(null);
                        })
                        .subscribe(() => this.plotarParadas());
                }
                this.loader.dismiss();
            })
            .catch(() => {
                this.loader.dismiss();
                this.navCtrl.pop();
            });
            
    }

    ionViewWillLeave() {
        if(!!this.loader && this.loader.dismiss) {
            this.loader.dismiss();
        }
    }

    limparParadas() {
        for (const paradaId of Array.from(this.mapParadasPlotadas.keys())) {
            this.mapParadasPlotadas.set(paradaId, false);
        }
    }

    carregarParadas(latitude: number, longitude: number, raio: number): Observable<any> {
        this.limparParadas();
        this.carregando = true;
        return this.ctmProvider.getParadas(latitude, longitude, raio)
            .switchMap((paradasIds: string[]) => {
                return paradasIds
                    .reduce((prev: Observable<Parada[]>, paradaId: string) => {
                        if (!this.mapParadasPlotadas.get(paradaId)) {
                            this.mapParadasPlotadas.set(paradaId, true);
                            if (!this.mapParadas.get(paradaId)) {
                                return prev.merge(this.listarParadasAdjacentes(paradaId));
                            }
                        }

                        return prev;
                    }, Observable.of([]));
            })
            .finally(() => {
                this.carregando = false;
                this.changeDetector.detectChanges();
            })
            .do((paradas: Parada[]) => {
                for (const parada of paradas) {
                    if (!this.mapParadas.get(parada.label)) {
                        this.mapParadas.set(parada.label, parada);
                    }
                }
            });
    }

    listarParadasAdjacentes(parada: string): Observable<Parada[]> {
        return this.ctmProvider.getLinhasDaParada(parada)
            .switchMap((linhas: string[]) => {
                const observables = linhas.map((linha: string) => this.ctmProvider.getLinha(linha));

                return Observable.forkJoin(observables);
            })
            .map((linhas: Linha[]) => {
                return linhas.reduce((paradas: Parada[], linha: Linha) => paradas.concat(linha.stops), []);
            });
    }

    plotarParadas() {
        const locais = [];
        for (const paradaId of Array.from(this.mapParadasPlotadas.keys())) {
            const parada = this.mapParadas.get(paradaId);
            if (this.mapParadasPlotadas.get(paradaId) && !!parada) {
                const local = new OSMLocal(parada.location.lat, parada.location.lon);
                local.displayName = CtmMapaParadasPage.PREFIXO_PARADA + parada.label;
                locais.push(local);
            }
        }
        this.locaisParadas = locais;
        this.changeDetector.detectChanges();
    }

    onAcaoLocal(acaoLocal: AcaoLocal) {
        if (acaoLocal.acao.nome === this.acoes[0].nome) {
            this.osm.reverse(acaoLocal.local)
                .subscribe((endereco: OSMEndereco) => {
                    const paradaId = acaoLocal.local.displayName.split(CtmMapaParadasPage.PREFIXO_PARADA)[1];
                    const parada = this.mapParadas.get(paradaId);
                    parada.endereco = `${endereco.city}, ${endereco.postcode}, ${endereco.road}`;
                    this.navCtrl.push(CtmParadaEstimativasPage, { parada });
                });
        }
    }

    onDragMapa(centro: LatLng) {
        this.centroAtual = centro;
        this.onChangeMapa();
    }

    onZoomMapa(raioMaximo: number) {
        this.raioParadas = Math.floor(raioMaximo);
        this.onChangeMapa();
    }

    onChangeMapa() {
        this.carregarParadas(this.centroAtual.lat, this.centroAtual.lng, this.raioParadas)
            .subscribe(() => this.plotarParadas());
    }

    voltar() {
        this.navCtrl.pop();
    }
}
