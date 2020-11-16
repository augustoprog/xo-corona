import { CtmLinhaItinerarioPage } from "./../ctm-linha-itinerario/ctm-linha-itinerario";
import { CtmProvider, LinhaDetalhe } from "./../../providers/ctm-provider";
import { Component, ChangeDetectorRef } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController
} from "ionic-angular";
import { removeEmoji } from "../../util/common";

@IonicPage()
@Component({
    selector: "page-ctm-listar-linhas",
    templateUrl: "ctm-listar-linhas.html"
})
export class CtmListarLinhasPage {
    public loader;
    //private resultado: any = '';
    linhas: any[] = [];
    listaOriginal;
    linhaId;
    search: string = '';

    semConexao: boolean = false;

    MinhasLinhasFavoritas = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private ctmProvider: CtmProvider,
        public loadingController: LoadingController,
        private changeDetector: ChangeDetectorRef
    ) { }

    applyExtinta(linhas: LinhaDetalhe[]) {
        for (var i = 0; i < linhas.length; i++) {
            if (linhas[i].nombre.indexOf("(EXTINTA)") != -1) {
                linhas[i].extinta = true;
                linhas[i].nombre =
                    linhas[i].nombre.indexOf("(EXTINTA)") == 0
                        ? linhas[i].nombre.replace("(EXTINTA) ", "")
                        : linhas[i].nombre.replace(" (EXTINTA)", "");
            }
        }
        this.linhas = linhas;
        this.listaOriginal = linhas;
    }

    ionViewDidLoad() {
        const linhasFavoritas = JSON.parse(window.localStorage.getItem("MinhasLinhasFavoritas"));
        if (!!linhasFavoritas) {
            this.MinhasLinhasFavoritas = linhasFavoritas;
        }

        this.loader = this.loadingController.create({
            content: "Carregando..."
        });
        this.loader.present();

        this.ctmProvider.getLinhas().subscribe(
            (linhas: LinhaDetalhe[]) => {
                this.loader.dismiss();
                this.applyExtinta(linhas);
            },
            error => {
                console.log(error);
                this.semConexao = error.status === 0;
                this.loader.dismiss();
            }
        );
    }

    initializeItems() {
        this.linhas = this.listaOriginal;
    }

    getItems(ev) {
        this.initializeItems();
        // set val to the value of the ev target
        var val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != "") {
            let filtro = val.toLowerCase();
            this.linhas = this.linhas.filter(item => {
                return item.nombre.toLowerCase().indexOf(filtro.toLowerCase()) > -1;
            });
        }
    }

    openPage(linhaId, linha) {
        //alert('Exibir itinerário da linha ' + linhaId);

        //////console.log('Id do orgao: ', linhaId);
        this.navCtrl.push(CtmLinhaItinerarioPage, {
            id: linhaId,
            linha: linha
        });
    }

    checaLinhaFavorita(id, label, nombre) {
        let linha = {
            id: id,
            label: label,
            nombre: nombre
        };
        //    ////console.log('p em checaParadaFavorita: ',p);
        if (
            JSON.parse(window.localStorage.getItem("MinhasLinhasFavoritas")) != null
        ) {
            this.MinhasLinhasFavoritas = JSON.parse(
                window.localStorage.getItem("MinhasLinhasFavoritas")
            );
        }

        let retorno = false;
        this.MinhasLinhasFavoritas.filter(item => {
            if (item.id === linha.id) {
                retorno = true;
            }
        });
        return retorno;
    }

    alternaLinhaFavorita(id, label, nombre) {
        const linha = {
            id: id,
            label: label,
            nombre: nombre
        };
        if (this.checaLinhaFavorita(id, label, nombre)) {
            this.MinhasLinhasFavoritas = JSON.parse(
                window.localStorage.getItem("MinhasLinhasFavoritas")
            );
            this.MinhasLinhasFavoritas = this.MinhasLinhasFavoritas
                .filter(item => item.id != linha.id);
            window.localStorage.setItem(
                "MinhasLinhasFavoritas",
                JSON.stringify(this.MinhasLinhasFavoritas)
            );
        } else {
            this.MinhasLinhasFavoritas.push(linha);
            window.localStorage.setItem(
                "MinhasLinhasFavoritas",
                JSON.stringify(this.MinhasLinhasFavoritas)
            );
        }
        this.changeDetector.detectChanges();
    }

    limparEmojis(texto: string): string {
        return removeEmoji(texto);
    }
}
