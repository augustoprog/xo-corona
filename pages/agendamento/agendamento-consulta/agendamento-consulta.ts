import { Component, ViewChild } from "@angular/core";
import { NgForm, NgModel } from "@angular/forms";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { Resultado, RootObject } from "../../../providers/agendamento/model";
import { AlertProvider } from "../../../providers/alert/alert";
import { endSession } from "../../../util/common";
import { AgendamentoStepOnePage } from "../agendamento-step-one/agendamento-step-one";

/**
 * Generated class for the ConsultaAgendamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-consulta",
  templateUrl: "agendamento-consulta.html"
})
export class AgendamentoConsultaPage {
  static nome = "AgendamentoConsultaPage";
  dataAgendamento;
  protocolo;
  isLogado: boolean;
  submitted: boolean = false;

  agendamentos: Resultado[] = null;

  @ViewChild("form") public form: NgForm;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private agendamentoProvider: AgendamentoProvider,
    private alert: AlertProvider
  ) {
    this.isLogado = !localStorage.getItem("dados-cidadao-logado")
      ? true
      : false;
  }

  ionViewDidLoad() {}

  isInvalidModel(submitted, model: NgModel) {
    console.log(submitted, model);
    return (model.dirty || model.touched || submitted) && model.invalid;
  }

  agendar() {
    this.navCtrl.push(AgendamentoStepOnePage).then(data => {
      this.form.reset();
      this.submitted = false;
    });
  }

  ionViewWillEnter() {
    this.submitted = false;
    this.form.reset();
    this.agendamentos = null;
    //this.submittForm(this.form);
  }

  consultarAgendamento(form: NgForm) {
    this.submitted = true;
    this.submittForm(this.form);
  }

  submittForm(form: NgForm) {
    if (form.valid) {
      let nascimento: string = `${this.dataAgendamento}T00:00:00.000Z`;
      let param: RootObject = {
        entidadeConsulta: { protocolo: this.protocolo },
        nascimento: nascimento
      };
      this.agendamentoProvider.search(param).subscribe(
        data => {
          if (data.resultado && data.resultado.length != 0) {
            this.agendamentos = data.resultado;
          } else {
            //Alert nenhum agendamento encontrado;
            this.agendamentos = null;
            this.alert.showError({
              subTitle: "Atenção.",
              msg: "Nenhum resultado encontrado.",
              buttons: [
                {
                  text: "OK"
                }
              ]
            });
          }
        },
        error => {
          endSession(this.navCtrl, this.alert, error);
        }
      );
    }
  }
}
