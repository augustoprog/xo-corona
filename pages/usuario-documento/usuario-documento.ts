import { UsuarioDocumentoEditarPage } from "./../usuario-documento-editar/usuario-documento-editar";
import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";
import { UsuarioDocumentoListaTiposPage } from "./../usuario-documento-lista-tipos/usuario-documento-lista-tipos";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";
import { KeycloakService } from "../../keycloak";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginPage } from "../login/login";
import { getErrorMessage } from "../../util/common";
import { AlertProvider } from "../../providers/alert/alert";

@IonicPage()
@Component({
  selector: "page-usuario-documento",
  templateUrl: "usuario-documento.html"
})
export class UsuarioDocumentoPage {
  loader: Loading;
  documentos: any;
  estrutura;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    private cadCidadaoProvider: CadCidadaoProvider,
    private keycloakService: KeycloakService,
    private alert: AlertProvider
  ) {}

  ionViewWillEnter() {
    //console.log("ionViewWillEnter UsuarioDocumentoPage");
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => this.getDocumentos(cidadao.id));
  }

  getListaTipoDocumentos() {
    //alert('Exibir Lista de Tipos de Documentoss...');
    this.navCtrl.push(UsuarioDocumentoListaTiposPage);
  }

  getDocumentos(cidadaoId) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.getDocumentos(cidadaoId).subscribe(
      res => {
        this.loader.dismissAll();
        this.documentos = res;

        for (let x of this.documentos) {
          x.tipoDocumento.jsonValidacao = JSON.parse(
            x.tipoDocumento.jsonValidacao.replace("\\", "")
          );
          x.json = JSON.parse(x.json.replace("\\", ""));
        }

        //console.log("getDocumentos 1:", this.documentos);
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar os documentos")
    );
  }

  editPage(documentoId, tipoDocumentoId) {
    this.navCtrl.push(UsuarioDocumentoEditarPage, {
      tipoDocumentoId: tipoDocumentoId,
      documentoId: documentoId
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
