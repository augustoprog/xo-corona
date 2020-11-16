import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";

import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";
import { AlertProvider } from "../../providers/alert/alert";
import { KeycloakService } from "../../keycloak";
import { getErrorMessage } from "../../util/common";

@IonicPage()
@Component({
  selector: "page-usuario-alterar-senha",
  templateUrl: "usuario-alterar-senha.html"
})
export class UsuarioAlterarSenhaPage {
  loader;
  email;
  senhaAtual;
  senhaNova;
  senhaConfirmacao;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private cadCidadaoProvider: CadCidadaoProvider,
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    private alert: AlertProvider,
    private keycloakService: KeycloakService
  ) { }

  ionViewDidLoad() {
    ////console.log(('ionViewDidLoad UsuarioAlterarSenhaPage');
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => {
        this.email = cidadao.email;
      });
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  alterarSenha(form) {
    if (!form.valid) {
      this.alert.showError({
        subTitle: "Atenção.",
        msg: "Preencha todos os campos obrigatórios.",
        buttons: [{ text: "ok" }]
      });
      return;
    }
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();

    if (
      this.senhaAtual == "" ||
      this.senhaAtual.length < 3 ||
      this.isNumber(this.senhaAtual) == false
    ) {
      this.loader.dismiss();

      let mensagem =
        "Senha Atual inválida! A senha deve ter no mínimo 3 dígitos e ser apenas números.";

      this.alert.showError({
        subTitle: "Atenção.",
        msg: mensagem,
        buttons: [{ text: "ok" }]
      });

      return;
    }

    if (
      this.senhaNova == "" ||
      this.senhaNova.length < 3 ||
      this.isNumber(this.senhaNova) == false
    ) {
      this.loader.dismiss();

      let mensagem =
        "Senha Nova Inválida! A senha deve ter no mínimo 3 dígitos e ser apenas números.";

      this.alert.showError({
        subTitle: "Atenção.",
        msg: mensagem,
        buttons: [{ text: "ok" }]
      });

      return;
    }

    if (this.senhaNova != this.senhaConfirmacao) {
      this.loader.dismiss();

      let mensagem =
        "Senha Nova diferente da senha informada para conferencia! A senha deve ter no mínimo 3 dígitos e ser apenas números.";

      this.alert.showError({
        subTitle: "Atenção.",
        msg: mensagem,
        buttons: [{ text: "ok" }]
      });

      return;
    }

    let objAltSenha: any = {
      senha: this.senhaAtual,
      novaSenha: this.senhaNova,
      confirmacaoSenha: this.senhaNova
    };

    this.cadCidadaoProvider.mudarSenha(objAltSenha).subscribe(
      res => {
        //window.localStorage.setItem('cidadaoLogado', JSON.stringify(res));
        //////console.log(('cidadaoLogado Retornado: ',JSON.stringify(res));

        ////console.log(('RETORNO do MÉTODO mudarSenha: ', res);

        //window.localStorage.setItem('cidadaoLogado', JSON.stringify(res));
        this.alert.showSuccess({
          subTitle: "",
          msg: "Senha alterada com sucesso.",
          buttons: [{ text: "ok" }]
        });
        this.loader.dismiss();
        this.navCtrl.pop();
      },
      e => {
        this.loader.dismiss();

        this.alert.showError({
          subTitle: "Atenção.",
          msg: `Erro ao tentar alterar senha do  cidadão:
          
          ${getErrorMessage(e)}`,
          buttons: [{ text: "ok" }]
        });
      }
    );
  }
}
