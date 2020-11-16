import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  Loading
} from "ionic-angular";

import { UsuarioCadastroService } from "./../usuario-cadastro/usuario-cadastro-service";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

@IonicPage()
@Component({
  selector: "page-modal-ocupacao",
  templateUrl: "modal-ocupacao.html"
})
export class ModalOcupacaoPage {
  loader: Loading;
  ocupacoes: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private usuarioCadastroService: UsuarioCadastroService,
    public viewCtrl: ViewController,
    private loadingController: LoadingController
  ) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.usuarioCadastroService.getOcupacao().subscribe(
      res => {
        this.ocupacoes = res;
        this.loader.dismiss();
        ////console.log('dentro de chama com texto: ' + texto, res);
      },
      error => {
        //console.log("Erro ao tentar recuperar a lista de ocupação/Tabela CBO.");
      }
    );
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad ModalOcupacao");
  }

  chama(texto: string) {
    //this.usuarioCadastroService.getOcupacao().subscribe(

    this.usuarioCadastroService.getOcupacaoByText(texto).subscribe(
      res => {
        this.ocupacoes = res;
        //this.loader.dismiss();
        ////console.log('dentro de chama com texto: ' + texto, res);
      },
      error => {
        //console.log("Erro ao tentar recuperar a lista de ocupação/Tabela CBO.");
      }
    );
  }

  getItems(ev) {
    // Reset items back to all of the items

    // set val to the value of the ev target
    var val = ev.target.value;

    this.chama(val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != "") {
      //let filtro = val.toLowerCase();
      this.ocupacoes = this.ocupacoes.filter(item => {
        return item.titulo.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  dismiss(ocupacao) {
    this.viewCtrl.dismiss(ocupacao);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  setOcupacao(ocupacao) {
    //alert('id: '+ocupacao.id+' cod: '+ocupacao.codigoCbo+' titulo: '+ocupacao.titulo);
    window.localStorage.setItem("ocupacao", JSON.stringify(ocupacao));

    this.dismiss(ocupacao);
  }
}
