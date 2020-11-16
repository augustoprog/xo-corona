import { CompesaProvider } from "./../../../providers/compesa-provider";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    ModalController,
    AlertController
} from "ionic-angular";
import { ServicoMapaPage } from "../../carta-servico/servico-mapa/servico-mapa";
import { OpenStreetMapProvider, OSMEndereco } from "../../../providers/open-street-map/open-street-map";
import { CallNumber } from "@ionic-native/call-number";

@IonicPage()
@Component({
    selector: "page-compesa-consulta-lojas-por-municipio-result",
    templateUrl: "compesa-consulta-lojas-por-municipio-result.html"
})
export class CompesaConsultaLojasPorMunicipioResultPage {
    public loader;
    public resultado: any = "";
    public idMunicipio: any = "";
    nome: string;

    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        private compesaProvider: CompesaProvider,
        public loadingController: LoadingController,
        private osm: OpenStreetMapProvider,
        private caller: CallNumber,
    ) {
        this.idMunicipio = navParams.get("idMunicipio");
        this.nome = navParams.get("nome");

        this.loader = this.loadingController.create({
            content: "Carregando..."
        });
        this.loader.present();

        this.compesaProvider.getLojasPorMunicipios(this.idMunicipio).subscribe(
            res => {
                this.resultado = res.retorno;
                this.loader.dismiss();
            },
            error => {
                this.loader.dismiss();
            }
        );
    }

    ionViewDidLoad() {
        ////console.log('ionViewDidLoad CompesaConsultaLojasPorMunicipioResultPage');
    }
    openLocation(loja, municipio) {
        const endereco = new OSMEndereco();
        endereco.country = 'Brasil';
        endereco.state = 'PE';
        endereco.city = municipio;
        endereco.suburb = loja.bairro;
        endereco.road = loja.logradouro;
        this.osm.search(endereco)
            .subscribe(
                (places) => {
                    if (!!places && places.length > 0) {
                        this.openModal({
                            locais: [places[0]],
                            unidade: loja.nomeLoja,
                            servico: "COMPESA"
                        });
                    } else {
                        this.openAlert();
                    }
                }
            );
    }

    openModal(data) {
        const modal = this.modalCtrl.create(ServicoMapaPage, data);
        modal.present();
    }

    openAlert() {
        let title =
            "<span class='alert-ico'><span class='mr-auto ml-auto'><img src='assets/images/error.png' /></span></span>";
        let msg =
            "<span class='alert-msg'>Não foi possível determinar a localização.</span>";
        const alert = this.alertCtrl.create({
            title: title,
            message: msg,
            cssClass: "custom-alert",
            buttons: [
                {
                    text: "Fechar",
                    role: "cancel",
                    handler: () => {
                        ////console.log('ão clicked');
                    }
                }
            ]
        });
        alert.present();
    }

    ligarNumero(numero: string) {
        this.caller.callNumber(numero, true);
    }
}
