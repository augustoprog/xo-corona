import { CartaServicoResultPage } from "./../carta-servico-result/carta-servico-result";
import { CartaServicoProvider } from "./../../../providers/carta-servico-provider";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";

/**
 * Generated class for the DetranConsultaCnh page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-menu-servicos-carta",
  templateUrl: "menu-servicos-carta.html"
})
export class MenuServicosCartaPage {
  public loader;
  private servicos: any[] = [];
  listaOriginal;
  private orgaoID: Number = null;

  tituloOrgao;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private cartaServicoProvider: CartaServicoProvider,
    public loadingController: LoadingController
  ) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();

    this.orgaoID = navParams.get("id");
    this.getListaServicos();
  }

  getListaServicos() {
    this.cartaServicoProvider.getListaServicos(this.orgaoID).subscribe(res => {
      this.servicos = res;
      this.tituloOrgao = res[0].categoria.orgao.sigla;
      this.listaOriginal = this.servicos;
      ////console.log('this.servicos: ', this.servicos);
      this.loader.dismiss();
    });
  }

  initializeItems() {
    this.servicos = this.listaOriginal;
  }

  ionViewDidLoad() {
    ////console.log('ionViewDidLoad MenuOrgaosCarta');
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      //let filtro = val.toLowerCase();
      this.servicos = this.servicos.filter(item => {
        return item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  openPage(servicoID) {
    ////console.log('Id do servico: ', servicoID);
    this.navCtrl.push(CartaServicoResultPage, {
      id: servicoID
    });
  }
}
