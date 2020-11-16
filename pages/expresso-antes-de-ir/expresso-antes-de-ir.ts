import { CartaServicoResultPage } from "./../carta-servico/carta-servico-result/carta-servico-result";
import { CartaServicoProvider } from "./../../providers/carta-servico-provider";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";
import { AlertProvider } from "../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-expresso-antes-de-ir",
  templateUrl: "expresso-antes-de-ir.html"
})
export class ExpressoAntesDeIrPage {
  public loader: Loading;
  private itens: any[] = [];
  private itens_raw: any[] = [];
  servicos: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private cartaServicoProvider: CartaServicoProvider,
    public loadingController: LoadingController,
    private alert: AlertProvider
  ) {
    this.getListaTodosServicos();
  }

  ionViewDidLoad() {}

  getListaTodosServicosOrig() {
    this.cartaServicoProvider.getListaTodosServicos().subscribe(
      res => {
        this.itens = res;
        this.itens = this.itens.filter(item => {
          return item.listaUnidadesAtendimento.filter(ua => {
            return ua.unidadeAtendimento.unidadeCompartilhada != null;
          });
        });
      },
      error => {}
    );
    ////console.log('this.itens: ', this.itens);
    //this.loader.dismiss();
  } //function

  getListaTodosServicos() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cartaServicoProvider.getListaExpressoCidadao().subscribe(
      res => {
        this.itens = res;
        this.loader.dismiss();

        for (let item of this.itens) {
          this.servicos.push(item);
          this.itens_raw.push(item);
        }
      },
      error => {
        this.loader.dismiss();
        this.alert.showError({
          subTitle: "Falha ao buscar os serviços",
          msg: "Favor tente mais tarde",
          buttons: [
            {
              text: "ok",
              handler: _ => {
                this.navCtrl.pop();
              }
            }
          ]
        });
      }
    );
  }

  getItems(ev) {
    // Reset items back to all of the items
    //this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      //let filtro = val.toLowerCase();
      this.servicos = this.itens_raw.filter(item => {
        return item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    } else {
      this.servicos = this.itens_raw;
    }
    //console.log("Servicos " + this.servicos.length);
  }

  openPage(servicoID) {
    //console.log("Id do servico: ", servicoID);
    this.navCtrl.push(CartaServicoResultPage, {
      id: servicoID
    });
  }
}
