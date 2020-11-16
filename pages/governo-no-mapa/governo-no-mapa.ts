import {
    CartaServicoProvider,
    Orgao,
    UnidadeAtendimento,
    TipoUnidade,
} from "./../../providers/carta-servico-provider";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    Loading,
    Alert,
    AlertOptions
} from "ionic-angular";
import { Geolocation, Geoposition } from "@ionic-native/geolocation";
import { ViewController } from "ionic-angular";
import { AlertController } from "ionic-angular";
import { LatLng, latLng } from "leaflet";
import { OSMLocal } from "../../providers/open-street-map/open-street-map";
import { Acao } from "../carta-servico/servico-mapa/servico-mapa";
import { AlertInputOptions } from "ionic-angular/components/alert/alert-options";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import { Diagnostic } from "@ionic-native/diagnostic";
import { AlertProvider } from "../../providers/alert/alert";
import { getErrorMessage } from "../../util/common";

@IonicPage()
@Component({
    selector: "page-governo-no-mapa",
    templateUrl: "governo-no-mapa.html"
})
export class GovernoNoMapaPage {

    loader: Loading;

    locaisGoverno: OSMLocal[];
    localAtual: OSMLocal;
    centroAtual: LatLng;
    acaoFiltro: Acao;
    filtroTipoUnidade: Map<number, boolean> = new Map<number, boolean>();

    alert: Alert;
    popupFiltro: AlertOptions;

    private unidades: UnidadeAtendimento[] = [];
    private tiposUnidades: TipoUnidade[] = [];

    constructor(
        private cartaServicoProvider: CartaServicoProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        private alertService: AlertProvider,
        public geolocation: Geolocation,
        private diagnostic: Diagnostic,
        public viewCtrl: ViewController,
        public loadingController: LoadingController,
    ) { }

    ionViewDidLoad() {
        const observables = [];
        this.loader = this.loadingController.create({
            content: "Carregando..."
        });
        this.loader.present();
        observables.push(this.getTiposUnidade()
            .finally(() => this.criarPopupFiltro()))
        observables[0]
            .subscribe((tiposUnidades: TipoUnidade[]) => this.tiposUnidades = tiposUnidades);
        observables.push(this.getTodasUnidades());
        observables[1]
            .subscribe((unidades: UnidadeAtendimento[]) => this.unidades = unidades);
        observables.push(this.diagnostic.isLocationEnabled()
            .then((isEnabled: boolean) => {
                if (isEnabled) {
                    return this.geolocation.getCurrentPosition();
                } else {
                    this.alertService.showError({
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
                }
            })
            .catch(() => this.navCtrl.pop()));

        Observable.forkJoin(observables)
            .catch(error => {
                this.alertService.showError({
                    subTitle: 'Erro!',
                    msg: error.status === 0 ? 'Sem conexão com a internet' : getErrorMessage(error),
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            this.navCtrl.pop();
                        }
                    }]
                });

                return Observable.of([]);
            })
            .subscribe(() => this.loader.dismiss());
    }

    ionViewWillLeave() {
        if(!!this.loader && this.loader.dismiss) {
            this.loader.dismiss();
        }
    }

    criarPopupFiltro() {
        this.acaoFiltro = {
            nome: 'Filtrar',
            icone: 'funnel'
        };
        this.popupFiltro = {
            title: 'Órgãos',
            cssClass: 'alert-governo-mapa',
            inputs: [{
                type: 'checkbox',
                label: 'SELECIONAR TODOS',
                handler: data => {
                    for (let i = 0; i < this.alert.data.inputs.length; i++) {
                        const element = this.alert.data.inputs[i];
                        element.checked = data.checked;
                    }
                }
            }],
            buttons: [{
                text: 'fechar',
                role: 'cancel',
                cssClass: 'btn-close'
            },
            {
                text: 'VISUALIZAR NO MAPA',
                handler: (data: string[]) => {
                    this.carregarFiltro(data);
                    this.aplicarFiltro();
                }
            }]
        };

        for (const tipoUnidade of this.tiposUnidades) {
            if (tipoUnidade.flagAtivo == true) {
                const checkboxInput: AlertInputOptions = {
                    type: 'checkbox',
                    label: tipoUnidade.titulo.toUpperCase(),
                    value: tipoUnidade.id.toString()
                };
                this.popupFiltro.inputs.push(checkboxInput);
            }
        }
    }

    getTiposUnidade(): Observable<TipoUnidade[]> {
        return this.cartaServicoProvider.getListaTiposUnidade()
            .map((tipos: TipoUnidade[]) => {
                const compare = (a: TipoUnidade, b: TipoUnidade) => {
                    if (
                        a.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "") <
                        b.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    )
                        return -1;
                    if (
                        a.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "") >
                        b.titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    )
                        return 1;
                    return 0;
                }

                return tipos.sort(compare);
            });
    }

    getTodasUnidades(): Observable<UnidadeAtendimento[]> {
        return this.cartaServicoProvider.getListaOrgaos()
            .switchMap((orgaos: Orgao[]) => {
                if (!!orgaos) {
                    const observables = orgaos
                        .map((orgao: Orgao) => this.cartaServicoProvider.getUnidadesAtendimento(orgao.id));

                    return Observable.forkJoin(observables);
                }
                return Observable.of([]);
            })
            .map((unidadesList: UnidadeAtendimento[][]) => {
                return unidadesList
                    .reduce((anterior: UnidadeAtendimento[], unidades: UnidadeAtendimento[]) => anterior
                        .concat(unidades), []);
            });
    }

    carregarFiltro(data: string[]) {
        for (const id of Array.from(this.filtroTipoUnidade.keys())) {
            this.filtroTipoUnidade.set(id, false);
        }
        for (const idString of data) {
            const id = parseInt(idString);
            if (!isNaN(id)) {
                this.filtroTipoUnidade.set(id, true);
            }
        }
    }

    aplicarFiltro() {
        const locais: OSMLocal[] = [];
        const mapaUnidades: Map<number, boolean> = new Map<number, boolean>();
        const mapaUnidadesCompartilhadas: Map<number, boolean> = new Map<number, boolean>();
        for (const unidade of this.unidades) {
            if (mapaUnidades.get(unidade.id) ||
                (!!unidade.unidadeCompartilhada && mapaUnidadesCompartilhadas.get(unidade.unidadeCompartilhada.id))) {
                continue;
            }
            if (this.filtroTipoUnidade.get(unidade.tipoUnidade.id)) {
                const latitude: number = parseFloat(unidade.enderecos[0].latitude);
                const longitude: number = parseFloat(unidade.enderecos[0].longitude);
                if (!isNaN(latitude) && !isNaN(longitude)) {
                    const local = new OSMLocal(latitude, longitude);
                    local.boundingbox = [latitude, latitude, longitude, longitude];
                    local.class = unidade.orgao.nome;
                    if (!unidade.unidadeCompartilhada) {
                        local.displayName = `${unidade.nome} (${unidade.orgao.sigla})`;
                        mapaUnidades.set(unidade.id, true);
                    } else {
                        local.displayName = unidade.unidadeCompartilhada.nome;
                        mapaUnidadesCompartilhadas.set(unidade.unidadeCompartilhada.id, true);
                    }
                    locais.push(local);
                }
            }
        }
        this.locaisGoverno = locais;
    }

    onAcaoFiltro() {
        let selecionados: number = 0;
        this.alert = this.alertCtrl.create(this.popupFiltro);
        for (let i = 1; i < this.alert.data.inputs.length; i++) {
            const element = this.alert.data.inputs[i];
            const id = parseInt(element.value);
            if (!isNaN(id)) {
                element.checked = this.filtroTipoUnidade.get(id);
                selecionados += element.checked ? 1 : 0;
            }
        }
        if (selecionados === this.tiposUnidades.length) {
            this.alert.data.inputs[0].checked = true;
        }
        this.alert.present();
    }
}
