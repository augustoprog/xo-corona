import { UsuarioDocumentoEditarPage } from "./../usuario-documento-editar/usuario-documento-editar";
import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading
} from "ionic-angular";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginPage } from "../login/login";
import { getErrorMessage } from "../../util/common";
import { AlertProvider } from "../../providers/alert/alert";
import { KeycloakService } from "../../keycloak";

/**
 * Generated class for the UsuarioDocumentoListaTiposPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-usuario-documento-lista-tipos",
  templateUrl: "usuario-documento-lista-tipos.html"
})
export class UsuarioDocumentoListaTiposPage {
  loader: Loading;
  tiposDocumentos: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public cadCidadaoProvider: CadCidadaoProvider,
    private alert: AlertProvider,
    private keycloakService: KeycloakService
  ) {
    this.getListaTiposDocumentos();
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad UsuarioDocumentoListaTiposPage");
  }

  getListaTiposDocumentos() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.getTiposDocumentos().subscribe(
      res => {
        this.loader.dismiss();
        this.tiposDocumentos = res;

        //console.log("getListaTiposDocumentos:", this.tiposDocumentos);
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar os tipos de documentos")
    );
  }

  addDocumento(tipoDocumentoId, td) {
    this.navCtrl.push(UsuarioDocumentoEditarPage, {
      tipoDocumentoId: tipoDocumentoId,
      td: td
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
