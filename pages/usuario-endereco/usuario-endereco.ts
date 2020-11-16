import { UsuarioEnderecoEditarPage } from "./../usuario-endereco-editar/usuario-endereco-editar";
import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";
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
  selector: "page-usuario-endereco",
  templateUrl: "usuario-endereco.html"
})
export class UsuarioEnderecoPage {
  loader: Loading;
  cidadaoId;
  enderecos: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingController: LoadingController,
    private cadCidadaoProvider: CadCidadaoProvider,
    private keycloakService: KeycloakService,
    private alert: AlertProvider
  ) {}

  ionViewWillEnter() {
    //console.log("ionViewWillEnter UsuarioEnderecoPage");

    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => {
        this.cidadaoId = cidadao.id;
        this.getEnderecos(this.cidadaoId);
      })
  }

  getEnderecos(cidadaoId) {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    //console.log(this.loader);
    this.cadCidadaoProvider.getEnderecos(cidadaoId).subscribe(
      res => {
        this.loader.dismiss();
        this.enderecos = res;
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar os endereços")
    );
  }

  enderecoEdit(cidadaoId, enderecoId) {
    this.navCtrl.push(UsuarioEnderecoEditarPage, {
      cidadaoId: cidadaoId,
      enderecoId: enderecoId
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
