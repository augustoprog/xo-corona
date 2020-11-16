import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Loading
} from "ionic-angular";

import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";
import { AlertProvider } from "../../providers/alert/alert";
import { KeycloakService } from "../../keycloak";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginPage } from "../login/login";
import { getErrorMessage } from "../../util/common";

@IonicPage()
@Component({
  selector: "page-usuario-contato-editar",
  templateUrl: "usuario-contato-editar.html"
})
export class UsuarioContatoEditarPage {
  cidadao: any;
  loader: Loading;
  tipoContatoId: number;
  contatoId: any;
  cidadaoLogadoId: number;

  tipoContato: any = null;

  contato: any = null;

  pattnerx;

  objContato: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private cadCidadaoProvider: CadCidadaoProvider,
    public loadingController: LoadingController,
    public alertCtrl: AlertController,
    private alert: AlertProvider,
    private keycloakService: KeycloakService
  ) {
    this.cadCidadaoProvider.getCidadao().subscribe(
      data => {
        //autentivou e está ativo
        this.cidadao = data;
      },
      error => this.tratarErroServico(error, "Erro ao buscar os dados do cidadão")
    );
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad UsuarioContatoEditarPage");
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => {
        this.cidadaoLogadoId = cidadao.id;
      });

    this.tipoContatoId = this.navParams.get("tipoContatoId");
    this.tipoContato = this.navParams.get("tc");

    if (this.navParams.get("contatoId") != undefined) {
      this.contatoId = this.navParams.get("contatoId");
      this.getContato();
    }

    if (!this.navParams.get("contatoId")) {
      //this.getTipoContato();
    }
    if (this.tipoContato) {
      if (typeof this.tipoContato.jsonValidacao == "string") {
        this.tipoContato.jsonValidacao = JSON.parse(
          this.tipoContato.jsonValidacao.split("'").join('"')
        );
      }
      this.criaObjetoContato(this.tipoContato.jsonValidacao.structure);
    }
  }

  getTipoContato() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.getTipoContato(this.tipoContatoId).subscribe(
      res => {
        this.tipoContato = res;
        this.tipoContato.jsonValidacao = JSON.parse(
          this.tipoContato.jsonValidacao.split("'").join('"')
        );
        this.loader.dismiss();

        //console.log(
        //   "this.tipoContato.jsonValidacao.structure: ",
        //   this.tipoContato.jsonValidacao.structure
        // );
        //console.log("getTipoContato:", this.tipoContato);

        this.criaObjetoContato(this.tipoContato.jsonValidacao.structure);
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar o tipo de contato")
    );
  }

  criaObjetoContato(jsonValidacao) {
    //console.log(jsonValidacao);
    for (let x of jsonValidacao) {
      //console.log(x);
      let input = {
        name: x.key,
        pattern: x.validation,
        inputType: x.inputType,
        placeholder: x.placeholder,
        value: this.contato ? this.contato.json[x.key] : ""
      };
      this.objContato.push(input);
    }
  }

  isInputsValidos() {
    for (let x = 0; x < this.objContato.length; x++) {
      let regexp = new RegExp(this.objContato[x].pattern),
        test = regexp.test(this.objContato[x].value);
      if (!test) {
        let mensagem =
          'O valor informado no campo "' +
          this.objContato[x].name +
          '" não está no formato correto: ' +
          this.objContato[x].placeholder;

        this.alert.showError({
          subTitle: "Erro",
          msg: mensagem,
          buttons: [{ text: "OK" }]
        });

        //$('#' + this.objContato[x].name).focus();
        return false;
      }
    }
    return true;
  }

  isValid(form, item: any) {
    if (form && form.form && form.form.controls) {
      if (form.form.controls[item] && form.form.controls[item].valid) {
        return true;
      }
    }
    return false;
  }

  salvaContato(form) {
    if (!form.valid) {
      //console.log(form);
      return false;
    }

    if (this.isInputsValidos() === true) {
      const contato: any = {
        tipoContato: {}
      };
      let json = {};
      this.objContato.filter(item => {
        json[item.name.trim()] = item.value.trim();
      });
      contato.tipoContato.id = this.tipoContatoId;
      contato.json = JSON.stringify(json).replace(/\"/g, '\'');
      contato.usuarioLogado = "";
      contato.orgaoLdapUsuarioLogado = null;

      if (!this.contatoId) {
        if (this.cidadao.contatos) {
          for (let i = 0; i < this.cidadao.contatos.length; i++) {
            const element = this.cidadao.contatos[i];
            if (
              element.tipoContato.id == this.tipoContatoId &&
              element.json == contato.json
            ) {
              this.alert.showError({
                subTitle: "Erro",
                msg: "Contato já existe.",
                buttons: [
                  {
                    text: "OK",
                    handler: () => {
                      this.navCtrl.popTo(
                        this.navCtrl.getByIndex(this.navCtrl.length() - 3)
                      );
                    }
                  }
                ]
              });
              return false;
            }
          }
        }
        contato.versao = 1;
        contato.usuarioLogado = "";
        this.loader = this.loadingController.create({
          content: "Carregando..."
        });
        this.loader.present();
        this.cadCidadaoProvider
          .postContato(this.cidadaoLogadoId, contato)
          .finally(() => {
            this.loader.dismiss();
          })
          .subscribe(
            res => {
              this.alert.showSuccess({
                subTitle: "Sucesso",
                msg: "Contato salvo com sucesso.",
                buttons: [
                  {
                    text: "OK",
                    handler: () => {
                      this.navCtrl.popTo(
                        this.navCtrl.getByIndex(this.navCtrl.length() - 3)
                      );
                    }
                  }
                ]
              });
            },
            error => this.tratarErroServico(error, "Erro ao salvar o contato")
          );
      } else {
        contato.id = this.contatoId;
        contato.versao = this.contato.versao;
        contato.usuarioLogado = null;

        this.loader = this.loadingController.create({
          content: "Carregando..."
        });
        this.loader.present();
        this.cadCidadaoProvider.putContato(contato).subscribe(
          res => {
            this.loader.dismiss();
            this.alert.showSuccess({
              subTitle: "Sucesso",
              msg: "Contato atualizado com sucesso.",
              buttons: [
                {
                  text: "OK",
                  handler: () => {
                    this.navCtrl.pop();
                  }
                }
              ]
            });
          },
          error => this.tratarErroServico(error, "Erro ao atualizar o contato")
        );
      }

      //this.navCtrl.push(UsuarioContatoPage);
    } // se Form é Valido
  }

  ionViewDidLeave() {
    if (this.loader) {
      this.loader.dismiss();
    }
  }

  getContato() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.getContato(this.contatoId).subscribe(
      res => {
        this.contato = res;
        this.loader.dismiss();
        this.contato.json = JSON.parse(this.contato.json.split("'").join('"'));
        this.tipoContato = this.contato.tipoContato;
        if (typeof this.tipoContato.jsonValidacao == "string") {
          this.tipoContato.jsonValidacao = JSON.parse(
            this.tipoContato.jsonValidacao.split("'").join('"')
          );
        }
        this.criaObjetoContato(this.tipoContato.jsonValidacao.structure);
      },
      error => this.tratarErroServico(error)
    );
  }

  deleteContato() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.deleteContato(this.contatoId).subscribe(
      res => {
        this.loader.dismiss();
        this.alert.showSuccess({
          subTitle: "Sucesso",
          msg: "Contato removido com sucesso.",
          buttons: [
            {
              text: "OK",
              handler: () => {
                this.loader.dismiss();
                this.navCtrl.pop();
              }
            }
          ]
        });
      },
      error => this.tratarErroServico(error, "Erro ao remover o contato")
    );
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
