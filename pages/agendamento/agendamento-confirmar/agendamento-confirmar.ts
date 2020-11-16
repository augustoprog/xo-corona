import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { Resultado } from "../../../providers/agendamento/model";
import { AlertProvider } from "../../../providers/alert/alert";
import { AgendamentoComprovantePage } from "../agendamento-comprovante/agendamento-comprovante";
import { endSession } from "../../../util/common";

/**
 * Generated class for the AgendamentoConfirmarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-confirmar",
  templateUrl: "agendamento-confirmar.html"
})
export class AgendamentoConfirmarPage {
  agendamento: Resultado;
  aceitePolitica: boolean = false;
  informacoesAdicionaisServico: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private agendamentoProvider: AgendamentoProvider,
    private alert: AlertProvider
  ) {
    this.agendamento = this.agendamentoProvider.getResultado();

    //this.agendamento.relacionados[0].infoAdicionaisDTO.informacoesAdicionais
    
    this.informacoesAdicionaisServico = this.agendamentoProvider.informacoesAdicionais;

    this.agendamentoProvider
      .getAgendamentoByToken(this.agendamento.protocolo)
      .subscribe(
        data => {
          this.agendamento = { ...data };         
        },
        error => {
          endSession(this.navCtrl, this.alert, error);
        }
      );
  }

  submitConfirmar(form: NgForm) {
    if (form.valid && this.aceitePolitica) {
      this.agendamentoProvider.confirmarAgendamento(this.agendamento).subscribe(
        data => {
          this.alert.showSuccess({
            subTitle: "Sucesso",
            msg: "Agendamento confirmado.",
            buttons: [{ text: "OK" }]
          });
          this.navCtrl.push(AgendamentoComprovantePage);
        },
        (error: HttpErrorResponse) => {
          let mensagem = error.error[0].error;
          this.alert.showError({
            subTitle: "Atenção.",
            msg: mensagem,
            buttons: [{ text: "OK" }]
          });
        }
      );
    } else {
      form.form.controls.aceitePolitica2.setErrors({ notValid: true });
    }
  }

  voltar() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() { }
}
