import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { AlertProvider } from "../../../providers/alert/alert";
import { AgendamentoStepTwoPage } from "../agendamento-step-two/agendamento-step-two";

/**
 * Generated class for the AgendamentoStepOnePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-step-one-confirmation",
  templateUrl: "agendamento-step-one-confirmation.html"
})
export class AgendamentoStepOnePageConfirmation {
  aceitePolitica = false;
  item: any;
  idService: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private agendamento: AgendamentoProvider,
    private alert: AlertProvider
  ) {
    this.idService = this.navParams.get("item").id;
    this.agendamento.getAgendamentoServicos(this.idService).subscribe(
      data => {
        this.item = data;
      },
      error => {
        let mensagem = JSON.parse(error._body)[0].error;

        this.alert.showError({
          subTitle: "Atenção.",
          msg: mensagem,
          buttons: [{ text: "OK" }]
        });
      }
    );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AgendamentoStepOnePage");
  }

  stepOneSubmit(form: NgForm) {
    if (this.aceitePolitica) {
      let servico = this.item;
      this.agendamento.start();
      this.agendamento.setServico(servico);
      this.navCtrl.push(AgendamentoStepTwoPage);
    } else {
      form.form.controls.aceitePolitica.setErrors({ notValid: true });
    }
  }

  voltar() {
    this.navCtrl.pop();
  }
}
