import {
    Component,
    ElementRef,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    OnInit,
} from "@angular/core";
import {
    NavParams,
    ViewController
} from "ionic-angular";
import {
    Marker,
    LatLng,
    Map as LMap,
    Popup,
    FeatureGroup,
    Icon,
    icon,
    TileLayerOptions,
    map,
    latLng,
    point,
    tileLayer,
    featureGroup,
    latLngBounds,
    marker,
    DomUtil,
    DomEvent,
    PolyLineOptions,
    polyline
} from 'leaflet';
import { OpenStreetMapProvider, OSMLocal } from "../../../providers/open-street-map/open-street-map";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface Acao {
    nome: string,
    icone?: string,
}

export interface AcaoLocal {
    local: OSMLocal
    acao: Acao,
}

@Component({
    selector: "page-servico-mapa",
    templateUrl: "servico-mapa.html",
})
export class ServicoMapaPage implements OnInit {

    @ViewChild('map') mapElement: ElementRef;

    @Input() title: string;
    @Input() servico: string;
    @Input() unidade: string;
    @Input()
    set locais(locais: OSMLocal[]) {
        this._locais.next(locais);
    }
    get locais(): OSMLocal[] {
        return this._locais.getValue();
    }
    @Input()
    set localAtual(localAtual: OSMLocal) {
        this._localAtual.next(localAtual);
    }
    get localAtual(): OSMLocal {
        return this._localAtual.getValue();
    }
    @Input()
    set caminhos(caminhos: LatLng[][]) {
        this._caminhos.next(caminhos);
    }
    get caminhos(): LatLng[][] {
        return this._caminhos.getValue();
    }
    @Input() acoes: Acao[];
    @Input() acaoToolbar: Acao;
    @Input() carregando: boolean;

    @Output() clickAcaoLocal: EventEmitter<AcaoLocal> = new EventEmitter<AcaoLocal>();
    @Output() clickAcaoToolbar: EventEmitter<void> = new EventEmitter<void>();
    @Output() dragMapa: EventEmitter<LatLng> = new EventEmitter<LatLng>();
    @Output() zoomMapa: EventEmitter<number> = new EventEmitter<number>();
    @Output() close: EventEmitter<void> = new EventEmitter<void>();

    _locais: BehaviorSubject<OSMLocal[]> = new BehaviorSubject<OSMLocal[]>(null);
    _localAtual: BehaviorSubject<OSMLocal> = new BehaviorSubject<OSMLocal>(null);
    _caminhos: BehaviorSubject<LatLng[][]> = new BehaviorSubject<LatLng[][]>(null);
    map: LMap;
    infoPopup: Popup[] = [];
    camadaMarcadores: FeatureGroup;
    camadaCaminhos: FeatureGroup;
    marcadorLocalAtual: Marker;
    mapaMarcadoresLocais: Map<string, Marker> = new Map<string, Marker>();

    static iconRed: Icon = icon({
        iconUrl: 'assets/marker-red.png',
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [30, 48],
        shadowSize: [29, 25],
        iconAnchor: [15, 44],
        shadowAnchor: [3, 22],
        popupAnchor: [0, -50]
    });
    static iconBlue: Icon = icon({
        iconUrl: 'assets/marker-blue.png',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -20]
    });
    static MAX_ZOOM: number = 18;

    isInit: boolean = false;

    constructor(
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private osm: OpenStreetMapProvider
    ) { }

    ionViewDidLoad() {
        this.init();
    }

    ngOnInit() {
        this.init();
    }

    init() {
        if (!this.isInit) {
            this.loadMap();
            this._locais.subscribe((locais: OSMLocal[]) => {
                this.setPlaces(locais, this.acoes, this.servico, this.unidade);
                this.setMapView(locais, null);
            });
            this._localAtual.subscribe((centro: OSMLocal) => {
                this.setMapView(this.locais, centro);
            });
            this._caminhos.subscribe((caminhos: LatLng[][]) => {
                this.setPaths(caminhos);
            });
            this.isInit = true;
        }
    }

    loadMap() {
        const servico: string = this.servico || this.navParams.get('servico');
        const unidade: string = this.unidade || this.navParams.get('unidade');
        const locais: OSMLocal[] = this.locais || this.navParams.get('locais');
        const centro: OSMLocal = this.localAtual || this.navParams.get('localAtual');
        const caminhos: LatLng[][] = this.caminhos || this.navParams.get('caminhos');
        const acoes: Acao[] = this.acoes || this.navParams.get('acoes');
        const mapOptions: TileLayerOptions = {
            maxZoom: ServicoMapaPage.MAX_ZOOM
        };

        if (!this.title) {
            this.title = servico;
        }
        this.map = map('map', {
            attributionControl: false,
            center: latLng(0, 0),
            zoom: ServicoMapaPage.MAX_ZOOM
        });
        this.map.on('dragend', () => this.dragMapa.emit(this.map.getCenter()));
        this.map.on('zoomend', () => {
            const size = this.map.getSize();
            const maxRadius = this.map
                .distance(
                    this.map.containerPointToLatLng(point(0, 0)),
                    this.map.containerPointToLatLng(point(size.x / 2, size.y / 2))
                );
            this.zoomMapa.emit(maxRadius);
        });
        tileLayer(this.osm.tileApiUrl, mapOptions)
            .addTo(this.map);
        this.camadaMarcadores = featureGroup([]);
        this.camadaCaminhos = featureGroup([]);
        this.map.addLayer(this.camadaMarcadores);
        this.map.addLayer(this.camadaCaminhos);
        this.setPlaces(locais, acoes, servico, unidade);
        this.setPaths(caminhos);
        this.setMapView(locais, centro);
    }

    getBoundingboxFromPlaces(locais: OSMLocal[]): number[] {
        const boundingbox = [];

        if (!!locais) {
            for (const local of locais) {
                for (let i = 0; i < 4; i++) {
                    if (!!local.boundingbox && (!boundingbox[i] ||
                        (!(i % 2) && local.boundingbox[i] > boundingbox[i]) ||
                        (!!(i % 2) && local.boundingbox[i] < boundingbox[i]))) {
                        boundingbox[i] = local.boundingbox[i];
                    }
                }
            }
        }

        return boundingbox;
    }

    setPlaces(locais: OSMLocal[], acoes: Acao[], servico: string, unidade: string) {
        if (!!locais) {
            const marcadoresRemover: Map<string, Marker> = new Map<string, Marker>(this.mapaMarcadoresLocais.entries());
            for (const local of locais) {
                const coords = latLng(local.lat, local.lon);
                if (!this.mapaMarcadoresLocais.get(coords.toString())) {
                    const content = this.getMarkerContent(local, acoes, servico, unidade);
                    this.mapaMarcadoresLocais.set(coords.toString(), this.addMarker(coords, content));
                } else {
                    marcadoresRemover.delete(coords.toString());
                }
            }
            for (const marcador of Array.from(marcadoresRemover.values())) {
                this.camadaMarcadores.removeLayer(marcador);
                this.mapaMarcadoresLocais.delete(marcador.getLatLng().toString());
            }
        }
    }

    setPaths(caminhos: LatLng[][]) {
        if (!!caminhos) {
            const blueLine: PolyLineOptions = { color: 'blue' }
            const redLine: PolyLineOptions = { color: 'red' }
            for (const layer of this.camadaCaminhos.getLayers()) {
                this.camadaCaminhos.removeLayer(layer);
            }
            for (let i = 0; i < caminhos.length; i++) {
                const caminho = caminhos[i];
                this.camadaCaminhos.addLayer(polyline(caminho, i % 2 === 0 ? blueLine : redLine));
            }
        }
    }

    setMapView(locais: OSMLocal[], localAtual: OSMLocal) {
        const boundingbox = this.getBoundingboxFromPlaces(locais);
        if (boundingbox.length === 4) {
            const coords1 = latLng(boundingbox[0], boundingbox[2]);
            const coords2 = latLng(boundingbox[1], boundingbox[3]);
            const bounds = latLngBounds(coords1, coords2);
            this.map.fitBounds(bounds);
        } else if (!!localAtual) {
            const coords = latLng(localAtual.lat, localAtual.lon);
            this.map.setView(coords, ServicoMapaPage.MAX_ZOOM);
            if (!!this.marcadorLocalAtual) {
                this.map.removeLayer(this.marcadorLocalAtual);
            }
            this.marcadorLocalAtual = this.addMarker(coords);
        } else if (!!locais && locais.length === 1) {
            const coords = latLng(locais[0].lat, locais[0].lon);
            this.map.setView(coords, ServicoMapaPage.MAX_ZOOM);
        }
    }

    getMarkerContent(local: OSMLocal, acoes: Acao[], servico: string, unidade: string) {
        const content = DomUtil.create('div');
        const title = DomUtil.create('span', 'font-12 d-block', content);
        const subtitleText = unidade || local.class;
        title.innerText = servico || local.displayName;
        if (!!subtitleText) {
            const subtitle = DomUtil.create('span', 'font-10', content);
            subtitle.innerText = subtitleText;
        }
        if (!!acoes) {
            for (const acao of acoes) {
                const button = DomUtil
                    .create('button', 'p-relative font-roboto-regular font-12 btn btn-primary round mx-auto mb-1', content);
                button.innerHTML = `<i class="${acao.icone} color-white"></i> ${acao.nome}`;
                DomEvent
                    .on(button, 'click', () => {
                        this.clickAcaoLocal.emit({ acao: acao, local: local });
                    });
            }
        }

        return content;
    }

    addMarker(coords: LatLng, content?: any): Marker {
        const marcador: Marker = marker(coords);
        this.camadaMarcadores.addLayer(marcador);

        if (!!content) {
            marcador.setIcon(ServicoMapaPage.iconRed);
            this.addInfoPopup(marcador, content);
        } else {
            marcador.setIcon(ServicoMapaPage.iconBlue);
            this.addInfoPopup(marcador, '<span class="font-12 d-block">Você está aqui</span>');
        }

        return marcador;
    }

    closeModal() {
        this.close.emit();
        this.viewCtrl.dismiss();
    }

    addInfoPopup(marker: Marker, content) {
        marker.bindPopup(content);
        this.infoPopup.push(marker.getPopup());
    }

    onClickAcaoToolbar() {
        this.clickAcaoToolbar.emit();
    }
}
