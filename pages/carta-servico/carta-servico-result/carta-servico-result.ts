import { Component } from "@angular/core";
import { CallNumber } from "@ionic-native/call-number";
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform,
  App
} from "ionic-angular";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { AppConfigProvider } from "../../../providers/app-config/app-config";
import {
  CartaServicoProvider,
  ListaPublicoAlvo,
  ListaUnidadesAtendimento,
  Servico,
  ServicosOnline,
  ServicosTelefonico
} from "../../../providers/carta-servico-provider";
import {
  OpenStreetMapProvider,
  OSMEndereco,
  OSMLocal
} from "../../../providers/open-street-map/open-street-map";
import { AgendamentoStepOnePageConfirmation } from "../../agendamento/agendamento-step-one-confirmation/agendamento-step-one-confirmation";
import { ServicoMapaPage } from "../servico-mapa/servico-mapa";
import { AvaliacaoPage } from "../../avaliacao/avaliacao";
import { environment } from "../../../environment";

/**
 * Generated class for the DetranConsultaCnh page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-carta-servico-result",
  templateUrl: "carta-servico-result.html"
})
export class CartaServicoResultPage {
  static nome = "CartaServicoResultPage";
  public loader;
  formasAtendimento: string = "presencial";
  formasAvaliacao: string = "avaliacao";
  isAndroid: boolean = false;
  exibeAvalia : boolean = environment.exibeAvalia;

  servico: Servico;
  servicoID: number;
  listaPublicoAlvo: ListaPublicoAlvo[];
  listaUnidadesAtendimento: ListaUnidadesAtendimento[];
  servicosTelefonicos: ServicosTelefonico[];
  servicosOnline: ServicosOnline[];
  isAgendavel: any;

  // private unidade: any;

  constructor(
    public _app: App,
    platform: Platform,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private cartaServicoProvider: CartaServicoProvider,
    public loadingController: LoadingController,
    private osm: OpenStreetMapProvider,
    private caller: CallNumber,
    private agendamento: AgendamentoProvider,
    private menuServicoProvider: AppConfigProvider
  ) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();

    this.isAndroid = platform.is("android");

    this.servicoID = navParams.get("id");
    this.getServico();
    this.isAgendavel =
      this.menuServicoProvider.habilitarAgendamentoCartaServico &&
      this.agendamento.isServicosComHorario(this.servicoID);
  }

  goToAgendamento() {
    this.navCtrl.push(AgendamentoStepOnePageConfirmation, {
      item: this.agendamento.getServicosComHorarioById(this.servicoID)
    });
  }

  openLocation(unidade) {
    //console.log(unidade);
    unidade.unidadeAtendimento.enderecos;
    if (
      unidade &&
      unidade.unidadeAtendimento &&
      unidade.unidadeAtendimento.enderecos &&
      unidade.unidadeAtendimento.enderecos[0]
    ) {
      const endereco: any = unidade.unidadeAtendimento.enderecos[0];
      if (
        !!endereco.latitude &&
        !!endereco.longitude &&
        endereco.latitude != "NI" &&
        endereco.longitude != "NI"
      ) {
        const place = new OSMLocal(endereco.latitude, endereco.longitude);
        this.openModal({
          locais: [place],
          unidade: unidade.unidadeAtendimento.nome,
          servico: this.servico.nome
        });
      } else {
        const e = new OSMEndereco();
        e.country = "Brasil";
        e.state = endereco.siglaUf;
        e.city = endereco.municipio;
        e.suburb = endereco.bairro;
        e.road = endereco.logradouro;
        e.houseNumber = endereco.numero;
        this.osm.search(e).subscribe((places: OSMLocal[]) => {
          if (!!places && places.length > 0) {
            this.openModal({
              locais: [places[0]],
              unidade: unidade.unidadeAtendimento.nome,
              servico: this.servico.nome
            });
          } else {
            this.openAlert();
          }
        });
      }
    } else {
      this.openAlert();
      // Não foi possível determinar a localização da unidade de atendimento.
    }
  }

  openAlert() {
    let title =
      "<span class='alert-ico'><span class='mr-auto ml-auto'><img src='assets/images/error.png' /></span></span>";
    let msg =
      "<span class='alert-msg'>Não foi possível determinar a localização da unidade de atendimento.</span>";
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

  openModal(obj) {
    let myModal = this.modalCtrl.create(ServicoMapaPage, obj);
    myModal.present();
  }

  getServico() {
    this.cartaServicoProvider
      .getServico(this.servicoID)
      .subscribe((servico: Servico) => {
        if (!!servico) {
          this.servico = servico;          
          this.servico.tempoEntrega = servico.tempoEntrega;

          this.listaPublicoAlvo = this.servico.listaPublicoAlvo;
          this.listaUnidadesAtendimento = this.servico.listaUnidadesAtendimento;
          this.servicosTelefonicos = this.servico.servicosTelefonicos;
          this.servicosOnline = this.servico.servicosOnline;

          if (
            this.listaUnidadesAtendimento &&
            this.listaUnidadesAtendimento.length != 0
          ) {
            this.formasAtendimento = "presencial";
          } else if (this.servicosOnline && this.servicosOnline.length != 0) {
            this.formasAtendimento = "internet";
          } else if (
            this.servicosTelefonicos &&
            this.servicosTelefonicos.length != 0
          ) {
            this.formasAtendimento = "telefonico";
          }
        }

        //unidade.unidadeAtendimento.listaHorariosFuncionamento
        //for each item in unidade.unidadeAtendimento.listaHorariosFuncionamento

        ////console.log('this.servico: ', this.servico);
        this.loader.dismiss();
      });
  }
  captalizeText(txt) {
    var t1 = txt.charAt(0);
    var t2 = txt.substring(1);
    var txtCaptalized = t1 + t2.toLowerCase();

    return txtCaptalized;
  }
  getTempoEntrega(txt) {
    //var txtCaptalized = txt.substring(0, 3);
    return txt;
  }

  ionViewDidLoad() {
    ////console.log('ionViewDidLoad CartaServicoResult');
  }

  openModalUnidadeAtendimento() {}

  temDia(obj, dia) {
    //////console.log('Objeto: ' , obj);
    //////console.log('dia: ' , dia);

    for (let item of obj) {
      if (item.siglaDiaSemana == dia) {
        return true;
      }
    }
    return false;
  }

  getLink(url: string) {
    if (url && !url.startsWith("http")) {
      return `http://${url}`;
    }
    return url;
  }

  ligarNumero(numero: string) {
    this.caller.callNumber(numero, true);
  }

  fixScroll() {
    setTimeout(() => {
      document.activeElement.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 350);
  }

  chamarAvaliacao() {
    this._app.getRootNav().push(AvaliacaoPage, {
        id: this.servicoID
    });
}
}
