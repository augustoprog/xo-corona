import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";

import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";
import { UsuarioContatoEditarPage } from "./../usuario-contato-editar/usuario-contato-editar";
import { getErrorMessage } from "../../util/common";
import { AlertProvider } from "../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-usuario-contato-lista-tipos",
  templateUrl: "usuario-contato-lista-tipos.html"
})
export class UsuarioContatoListaTiposPage {
  loader: Loading;
  tiposContatos: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public cadCidadaoProvider: CadCidadaoProvider,
    private alert: AlertProvider
  ) {
    this.getListaTiposContatos();
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad UsuarioContatoListaTiposPage");
  }

  getListaTiposContatos() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.getTiposContatos().subscribe(
      res => {
        this.tiposContatos = res;
        this.loader.dismiss();
        //console.log("getListaTiposContatos:", this.tiposContatos);
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar os tipos de contatos")
    );
  }

  addContato(tipoContatoId, tc) {
    this.navCtrl.push(UsuarioContatoEditarPage, {
      tipoContatoId: tipoContatoId,
      tc: tc
    });
  }

  private tratarErroServico(e: any, title?: string) {
    if(!!this.loader && !!this.loader.dismiss) {
      this.loader.dismiss();
    }
    this.alert.showError({
      subTitle: title || "Erro!",
      msg: getErrorMessage(e),
      buttons: [{ text: "OK" }]
    });
  }
}
