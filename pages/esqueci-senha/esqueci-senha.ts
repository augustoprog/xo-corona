import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AlertProvider } from "../../providers/alert/alert";
import { CadCidadaoProvider } from "../../providers/cad-cidadao/cad-cidadao";
import { getErrorMessage } from "../../util/common";

@IonicPage()
@Component({
  selector: "page-esqueci-senha",
  templateUrl: "esqueci-senha.html"
})
export class EsqueciSenhaPage {
  showEmails: Boolean;
  emails: any[];
  email: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alert: AlertProvider,
    private cadCidadaoProvider: CadCidadaoProvider
  ) {
    this.showEmails = false;
    this.emails = [{ email: "asd***@gmail.com" }, { email: "dsa@***@ati.com" }];
  }

  ionViewDidLoad() {}

  navVoltar() {
    this.navCtrl.pop();
  }

  consultar(form) {
    //this.showEmails = true;

    if (!form.valid) {
      return false;
    }

    this.cadCidadaoProvider.esqueciSenha(this.email).subscribe(
      data => {
        this.alert.showSuccess({
          subTitle: "E-mail enviado com sucesso",
          msg:
            "verifique seu e-mail e siga as instruções para cadastrar a nova senha.",
          buttons: [
            {
              text: "ok",
              handler: _ => {
                this.navCtrl.pop();
                this.email = "";
              }
            }
          ]
        });
      },
      e => {
        this.alert.showError({
          subTitle: "Falha ao enviar email.",
          msg: getErrorMessage(e),
          buttons: [
            {
              text: "ok",
              handler: _ => {
                //this.navCtrl.pop();
              }
            }
          ]
        });
      }
    );
  }

  enviar() {
    this.alert.showSuccess({
      subTitle: "E-mail enviado com sucesso",
      msg:
        "verifique seu e-mail e siga as instruções para cadastrar a nova senha.",
      buttons: [
        {
          text: "ok",
          handler: _ => {
            this.navCtrl.pop();
          }
        }
      ]
    });
  }
}
