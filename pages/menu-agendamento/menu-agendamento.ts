import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AgendamentoProvider } from "../../providers/agendamento/agendamento";
import { Resultado, RootObject } from "../../providers/agendamento/model";
import { AlertProvider } from "../../providers/alert/alert";
import { endSession, getCidadaoLogado, isLogged } from "../../util/common";
import { AgendamentoConsultaPage } from "../agendamento/agendamento-consulta/agendamento-consulta";
import { AgendamentoStepOnePage } from "../agendamento/agendamento-step-one/agendamento-step-one";

/**
 * Generated class for the MenuAgendamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-menu-agendamento",
  templateUrl: "menu-agendamento.html"
})
export class MenuAgendamentoPage {
  static nome = "MenuAgendamentoPage";
  pageAgendamentoConsulta: any = AgendamentoConsultaPage;
  pageAgendamentoStepOnePage: any = AgendamentoStepOnePage;

  agendamentos: Resultado[] = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private agendamentoProvider: AgendamentoProvider,
    private alert: AlertProvider
  ) {}

  ionViewDidLoad() {}

  ionViewWillEnter() {
    if (isLogged()) {
      let param: RootObject = {
        cidadaoId: getCidadaoLogado().id,
        primeiroResultado: 0,
        tamanhoPagina: 100
      };
      this.agendamentoProvider.search(param).subscribe(
        data => {
          if (data.resultado && data.resultado.length != 0) {
            this.agendamentos = data.resultado;

            let countAlert = 0;
            for (const agenda of this.agendamentos) {
              if (
                agenda.status == "A_CONFIRMAR" ||
                agenda.status == "RESERVADO"
              ) {
                countAlert++;
              }
            }

            if (countAlert != 0) {
              let msg =
                countAlert > 1
                  ? "Existem agendamentos que necessitam de confirmação."
                  : "Existe um agendamento que necessita de confirmação.";
              this.alert.showWarning({
                subTitle: "Atenção",
                msg,
                buttons: [{ text: "OK" }]
              });
            }
          }
        },
        error => {
          endSession(this.navCtrl, this.alert, error);
        }
      );
    }
  }
}
