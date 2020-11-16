import { UsuarioContatoEditarPage } from "./../usuario-contato-editar/usuario-contato-editar";
import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";

import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";

import { UsuarioContatoListaTiposPage } from "./../usuario-contato-lista-tipos/usuario-contato-lista-tipos";
import { KeycloakService } from "../../keycloak";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginPage } from "../login/login";
import { getErrorMessage } from "../../util/common";
import { AlertProvider } from "../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-usuario-contato",
  templateUrl: "usuario-contato.html"
})
export class UsuarioContatoPage {
  loader: Loading;
  contatos: any;
  estrutura;
  teste;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public cadCidadaoProvider: CadCidadaoProvider,
    private keycloakService: KeycloakService,
    private alert: AlertProvider
  ) {}

  ionViewWillEnter() {
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => this.getContatos(cidadao.id));
  }

  getListaTipoContato() {
    //alert('Exibir Lista de Tipos de Contatos...');
    this.navCtrl.push(UsuarioContatoListaTiposPage);
  }

  getContatos(cidadaoId) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.getContatos(cidadaoId).subscribe(
      res => {
        this.loader.dismiss();
        this.contatos = res;

        for (let x of this.contatos) {
          x.tipoContato.jsonValidacao = JSON.parse(
            x.tipoContato.jsonValidacao.split("'").join('"')
          );
          x.json = JSON.parse(x.json.split("'").join('"'));
        }
      },
      error => this.tratarErroServico(error)
    );
  }

  getEstrutura(estrutura) {
    this.estrutura = JSON.parse(JSON.stringify(estrutura));
  }

  traduz(x) {
    //alert(x);
    return x;
  }

  ionViewDidLeave() {
    this.loader.dismiss();
  }

  editPage(contatoId, tipoContatoId) {
    this.navCtrl.push(UsuarioContatoEditarPage, {
      tipoContatoId: tipoContatoId,
      contatoId: contatoId
    });
  }

  private tratarErroServico(e: any, title?: string) {
    if(!!this.loader && !!this.loader.dismiss) {
      this.loader.dismiss();
    }
    if (e instanceof HttpErrorResponse && e.status == 403) {
      this.alert.showError({
        subTitle: title || "Atenção",
        msg: "A sua sessão expirou, favor efetue o login novamente.",
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.keycloakService.logout();
              this.navCtrl.setRoot(LoginPage);
            }
          }
        ]
      });
    } else {
      this.alert.showError({
        subTitle: title || "Erro!",
        msg: getErrorMessage(e),
        buttons: [{ text: "OK" }]
      });
    }
  }
}
