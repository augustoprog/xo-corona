import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";

@IonicPage()
@Component({
  selector: "notificacao-detalhe",
  templateUrl: "notificacao-detalhe.html"
})
export class NotificacaoDetalhePage {
  public notificacao: any;
  public textBlock: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController
  ) {
    this.notificacao = this.navParams.get('notificacao');
    this.textBlock = `<p>${this.notificacao.texto}</p>`;
  }

  ionViewDidLoad() { }

}
