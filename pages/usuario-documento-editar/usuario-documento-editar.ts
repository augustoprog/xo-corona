import { CadCidadaoProvider, Documento } from "./../../providers/cad-cidadao/cad-cidadao";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Loading
} from "ionic-angular";
import { AlertProvider } from "../../providers/alert/alert";
import { KeycloakService } from "../../keycloak";
import { getErrorMessage } from "../../util/common";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: "page-usuario-documento-editar",
  templateUrl: "usuario-documento-editar.html"
})
export class UsuarioDocumentoEditarPage {
  loader: Loading;
  tipoDocumentoId: number;
  documentoId: any;
  cidadaoLogadoId: number;
  cidadao: any;

  tipoDocumento: any = null;

  documento: any = null;

  pattnerx;

  objDocumento: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private cadCidadaoProvider: CadCidadaoProvider,
    private loadingController: LoadingController,
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
    //console.log("ionViewDidLoad UsuarioDocumentoEditarPage");

    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => this.cidadaoLogadoId = cidadao.id);
    this.tipoDocumento = this.navParams.get("td");

    this.tipoDocumentoId = this.navParams.get("tipoDocumentoId");

    if (this.navParams.get("documentoId")) {
      this.documentoId = this.navParams.get("documentoId");
      this.getDocumento();
    }

    if (!this.navParams.get("documentoId")) {
      //this.getTipoDocumento();
    }

    if (this.tipoDocumento) {
      if (typeof this.tipoDocumento.jsonValidacao == "string") {
        this.tipoDocumento.jsonValidacao = JSON.parse(
          this.tipoDocumento.jsonValidacao.split("'").join('"')
        );
      }
      this.criaObjetoDocumento(this.tipoDocumento.jsonValidacao.structure);
    }
  }

  isValid(form, item: any) {
    if (form && form.form && form.form.controls) {
      if (form.form.controls[item] && form.form.controls[item].valid) {
        return true;
      }
    }
    return false;
  }

  getTipoDocumento() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.getTipoDocumento(this.tipoDocumentoId).subscribe(
      res => {
        this.loader.dismiss();
        this.tipoDocumento = res;
        this.tipoDocumento.jsonValidacao = JSON.parse(
          this.tipoDocumento.jsonValidacao.replace("\\", "")
        );

        this.criaObjetoDocumento(this.tipoDocumento.jsonValidacao.structure);
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar o tipo de documento")
    );
  }

  criaObjetoDocumento(jsonValidacao) {
    for (let x of jsonValidacao) {
      //console.log(x);
      let input = {
        name: x.key,
        pattern: x.validation,
        inputType: x.inputType,
        placeholder: x.placeholder,
        value: this.documento ? this.documento.json[x.key] : ""
      };
      this.objDocumento.push(input);
    }
  }

  isInputsValidos() {
    for (let x = 0; x < this.objDocumento.length; x++) {
      let regexp = new RegExp(this.objDocumento[x].pattern),
        test = regexp.test(this.objDocumento[x].value);

      if (!test) {
        let mensagem =
          'O valor informado no campo "' +
          this.objDocumento[x].name +
          '" não está no formato correto: ' +
          this.objDocumento[x].placeholder;

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

  salvaDocumento(form) {
    if (!form.valid) {
      return false;
    }

    if (this.isInputsValidos() === true) {
      let json = {};
      this.objDocumento.filter(item => {
        json[item.name.trim()] = item.value.trim();
      });

      if (!this.documentoId) {
        if (this.cidadao.documentos) {
          for (let i = 0; i < this.cidadao.documentos.length; i++) {
            const element = this.cidadao.documentos[i];
            if (element.tipoDocumento.id == this.tipoDocumentoId) {
              this.alert.showError({
                subTitle: "Erro",
                msg: "Documento já cadastrado.",
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
        const documento = new Documento();
        documento.tipoDocumento.id = this.tipoDocumentoId;
        documento.json = JSON.stringify(json);
        documento.versao = 1;
        documento.usuarioLogado = "";
        documento.orgaoLdapUsuarioLogado = null;

        this.loader = this.loadingController.create({
          content: "Carregando..."
        });
        this.loader.present();
        this.cadCidadaoProvider
          .postDocumento(this.cidadaoLogadoId, documento)
          .subscribe(
            res => {
              this.loader.dismiss();
              this.alert.showSuccess({
                subTitle: "Sucesso",
                msg: "Documento salvo com sucesso.",
                buttons: [{ text: "OK" }]
              });
              this.navCtrl.popTo(
                this.navCtrl.getByIndex(this.navCtrl.length() - 3)
              );
            },
            error => this.tratarErroServico(error, "Erro ao tentar salvar o documento")
          );
      } else {
        let documento = new Documento();
        documento.id = this.documentoId;
        documento.tipoDocumento.id = this.tipoDocumentoId;
        documento.json = JSON.stringify(json);
        documento.versao = this.documento.versao,
        documento.usuarioLogado = null;
        documento.orgaoLdapUsuarioLogado = null;

        //console.log("documento a ser atualizado", documento);
        this.loader = this.loadingController.create({
          content: "Carregando..."
        });
        this.loader.present();
        this.cadCidadaoProvider.putDocumento(documento).subscribe(
          res => {
            this.loader.dismiss();
            this.alert.showSuccess({
              subTitle: "Sucesso",
              msg: "Documento atualizado com sucesso.",
              buttons: [{ text: "OK" }]
            });
            //this.navCtrl.popTo(ProfilePage);
            this.navCtrl.pop();
          },
          error => this.tratarErroServico(error, "Erro ao tentar atualizar o documento")
        );
      }
    } // se Form é Valido
  }

  getDocumento() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.getDocumento(this.documentoId).subscribe(
      res => {
        this.documento = res;
        this.loader.dismiss();
        this.documento.json = JSON.parse(this.documento.json.replace("\\", ""));
        //console.log("Documento Recuperado com sucesso (retorno):", res);
        this.getTipoDocumento();
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar o documento do usuário")
    );
  }

  deleteDocumento() {
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    this.cadCidadaoProvider.deleteDocumento(this.documentoId).subscribe(
      res => {
        this.loader.dismiss();
        this.alert.showSuccess({
          subTitle: "Sucesso",
          msg: "Documento removido com sucesso.",
          buttons: [{ text: "OK" }]
        });

        //this.navCtrl.push(UsuarioDocumentoPage);
        //this.navCtrl.popTo(ProfilePage);
        this.navCtrl.pop();
      },
      error => this.tratarErroServico(error, "Erro ao tentar remover o documento")
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
