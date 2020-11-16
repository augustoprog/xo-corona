import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { AgendamentoStepOnePageConfirmation } from "../agendamento-step-one-confirmation/agendamento-step-one-confirmation";

/**
 * Generated class for the AgendamentoStepOnePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-step-one",
  templateUrl: "agendamento-step-one.html"
})
export class AgendamentoStepOnePage {
  idServico: any;
  servicos: any[] = [];
  servicosFiltered: ServicoOption[] = [];
  aceitePolitica = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private agendamento: AgendamentoProvider
  ) {
    this.idServico = this.navParams.get("id");
  }

  ionViewDidLoad() {
    this.agendamento.fetchServicosComHorario().subscribe((data: any[]) => {
      this.servicos = data;
      this.servicosFiltered = this.servicos.map(item => ({
        displayValue: item.nome,
        option: item.id
      }));
    });
  }

  goToConfirmation(selected: ServicoOption) {
    this.navCtrl.push(AgendamentoStepOnePageConfirmation, {
      item: this.servicos.find(item => item.id == selected.option)
    });
  }

  filter(value) {
    this.servicosFiltered = this.servicos
      .map(item => ({
        displayValue: item.nome,
        option: item.id
      }))
      .filter(
        i =>
          !!value === false ||
          i.displayValue.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );
  }
}

interface ServicoOption {
  displayValue: string;
  option: any;
}
