import { Component } from "@angular/core";
import { IonicPage, Loading, LoadingController, NavController } from "ionic-angular";
import "rxjs/add/observable/of";
import { Observable } from "rxjs/Observable";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { CartaServicoProvider, Servico, ServicoDestaque } from "../../../providers/carta-servico-provider";
import { getThemeColor } from "../../../util/common";
import { CartaServicoResultPage } from "../carta-servico-result/carta-servico-result";

@IonicPage()
@Component({
    selector: 'page-menu-servicos-destaque',
    templateUrl: './menu-servicos-destaque.html'
})
export class MenuServicosDestaquePage {

    servicosBusca: Servico[];
    servicosDestaque: Servico[];
    termoServico: string;
    buscandoResultados: boolean;
    semConexao: boolean = false;

    private loader: Loading;

    constructor(
        private navCtrl: NavController,
        private cartaServicoProvider: CartaServicoProvider,
        private loadingController: LoadingController,
        private agendamento:AgendamentoProvider
    ) { }

    ionViewDidLoad() {
        this.agendamento.fetchServicosComHorario().subscribe()
        this.carregarServicosDestaque();
    }

    carregarServicosDestaque() {
        this.loader = this.loadingController.create({ content: 'Carregando...' });
        this.loader.present();
        this.cartaServicoProvider.getListaServicosDestaque()
            .catch((e) => {
                this.semConexao = e.status === 0;
                return Observable.of([]);
            })
            .finally(() => this.loader.dismiss())
            .map((servicosDestaque: ServicoDestaque[]) => servicosDestaque.map(servicoDestaque => servicoDestaque.servico))
            .subscribe((servicosDestaque: Servico[]) => this.servicosDestaque = servicosDestaque);
    }

    abrirServico(servico: Servico): void {
        this.navCtrl.push(CartaServicoResultPage, { id: servico.id });
    }

    abrirWWWServico(servico: Servico): void {
        window.open(servico.servicosOnline[0].url);
    }

    buscarServico() {
        this.buscandoResultados = true;
        this.cartaServicoProvider.buscar(this.termoServico)
            .subscribe((servicosBusca: Servico[]) => {
                this.buscandoResultados = false;
                this.servicosBusca = servicosBusca;
            });
    }

    getIcon = (servicoDestaque: ServicoDestaque): string => {
        const servico: Servico = servicoDestaque.servico;
        if (servico.listaTemaServico.length) {
            if (
                servico.listaTemaServico[0].temaServico.icone === '' ||
                servico.listaTemaServico[0].temaServico.icone == null
            ) {
                return 'fa-shield';
            }
            return servico.listaTemaServico[0].temaServico.icone;
        }
        return 'fa-shield';
    }

    getColor = (servicoDestaque: ServicoDestaque): string => {
        const servico = servicoDestaque.servico;
        const themeId = servico.listaTemaServico.length > 0 ? servico.listaTemaServico[0].id : 0;
        return getThemeColor(themeId);
    }

}