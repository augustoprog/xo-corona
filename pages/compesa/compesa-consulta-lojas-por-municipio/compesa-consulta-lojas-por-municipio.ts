import { CompesaConsultaLojasPorMunicipioResultPage } from "./../compesa-consulta-lojas-por-municipio-result/compesa-consulta-lojas-por-municipio-result";
import { CompesaProvider } from "./../../../providers/compesa-provider";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";

/**
 * Generated class for the CompesaConsultaLojasPorMunicipioPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-compesa-consulta-lojas-por-municipio",
  templateUrl: "compesa-consulta-lojas-por-municipio.html"
})
export class CompesaConsultaLojasPorMunicipioPage {
  public loader;
  private resultado: any = "";
  resultado2;

  semConexao: boolean = false;
  //private resultadoDetalhe: any = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private compesaProvider: CompesaProvider,
    public loadingController: LoadingController
  ) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();

    this.compesaProvider.getListaMunicipios().subscribe(
      res => {
        ////console.log(res);
        this.resultado = res.retorno;

        this.resultado2 = this.resultado;

        this.semConexao = false;
        this.loader.dismiss();
      },
      error => {
        this.semConexao = error.status === 0;
        this.loader.dismiss();
      }
    );
  }
  /*
    getDetalhes(idMunicipio){
      this.compesaProvider.getLojasPorMunicipios(idMunicipio)
        .subscribe(
        res => {
  
          //////console.log(res);
          this.resultadoDetalhe = res.retorno;
          
  
        },
        error => {
          ////console.log('Erro ao tentar recuperar detalhes da loja.', error);
          
        }
        );
    }
  */
  openPage(idMunicipio, nome) {
    this.navCtrl.push(CompesaConsultaLojasPorMunicipioResultPage, {
      idMunicipio,
      nome
    });
  }

  ionViewDidLoad() {
    ////console.log('ionViewDidLoad CompesaConsultaLojasPorMunicipioPage');
  }

  initializeItems() {
    this.resultado2 = this.resultado;
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      //let filtro = val.toLowerCase();
      this.resultado2 = this.resultado2.filter(item => {
        return item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }
}
