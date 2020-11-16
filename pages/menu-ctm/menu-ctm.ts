import { CtmLinhaItinerarioPage } from "./../ctm-linha-itinerario/ctm-linha-itinerario";
import { CtmParadaEstimativasPage } from "./../ctm-parada-estimativas/ctm-parada-estimativas";
import { CtmMapaParadasPage } from "./../ctm-mapa-paradas/ctm-mapa-paradas";
import { CtmListarLinhasPage } from "./../ctm-listar-linhas/ctm-listar-linhas";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    ToastController,
    ModalController
} from "ionic-angular";
import { Parada } from "../../providers/ctm-provider";

@IonicPage()
@Component({
    selector: "page-menu-ctm",
    templateUrl: "menu-ctm.html"
})
export class MenuCtmPage {
    offline: boolean;
    checaRede;
    MinhasParadasFavoritas;
    MinhasLinhasFavoritas;
    exibirParadasFavoritas: boolean;
    exibirLinhasFavoritas: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public modalCtrl: ModalController
    ) {
        this.exibirParadasFavoritas = false;
        this.exibirLinhasFavoritas = false;
    }

    ionViewWillEnter() {
        this.MinhasParadasFavoritas = JSON.parse(
            window.localStorage.getItem("MinhasParadasFavoritas")
        );
        this.MinhasLinhasFavoritas = JSON.parse(
            window.localStorage.getItem("MinhasLinhasFavoritas")
        );
    }

    openModal() { }

    openPage(pagina) {
        if (pagina == "CtmListarLinhasPage") {
            this.navCtrl.push(CtmListarLinhasPage);
        }
        if (pagina == "CtmMapaParadasPage") {
            this.navCtrl.push(CtmMapaParadasPage);
        }
        if (pagina == "CompesaConsultaLojasPorMunicipioPage") {
            //this.navCtrl.push(CompesaConsultaLojasPorMunicipioPage);
        }
        if (pagina == "CompesaConsultaProtocoloPage") {
            //this.navCtrl.push(CompesaConsultaProtocoloPage);
        }
    }

    ionViewCanEnter() { }

    ionViewWillLeave() {
        clearInterval(this.checaRede);
    }

    verParada(parada: Parada) {
        this.navCtrl.push(CtmParadaEstimativasPage, { parada });
    }

    openPageIntinerario(linhaId, nombre) {
        this.navCtrl.push(CtmLinhaItinerarioPage, {
            id: linhaId,
            linha: nombre
        });
    }
}
