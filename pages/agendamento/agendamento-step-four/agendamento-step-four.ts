import { Component } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import "rxjs/add/observable/forkJoin";
import { Observable } from "rxjs/Observable";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { Pessoa } from "../../../providers/agendamento/model";
import { AlertProvider } from "../../../providers/alert/alert";
import { endSession } from "../../../util/common";
import { AgendamentoStepFivePage } from "../agendamento-step-five/agendamento-step-five";

/**
 * Generated class for the AgendamentoStepFourPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-step-four",
  templateUrl: "agendamento-step-four.html",
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AgendamentoStepFourPage {
  requerente: any;
  relacionados: any[];
  infoAdicionais: any[];
  maximoPorAgendamento: number;
  selecionados: Pessoa[] = [];
  titular: any;
  dependentes: any[] = [];
  diasPenalidade: number;
  idServico: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alert: AlertProvider,
    private agendamento: AgendamentoProvider
  ) {
    this.idServico = this.agendamento.resultado.horarioAgenda.servicoUnidade.servico.id.toString();
    this.agendamento.getCamposAdicionais(this.idServico).subscribe(
      data => {
        this.infoAdicionais = data;
      },
      error => {
        endSession(this.navCtrl, this.alert, error);
      }
    );
    this.requerente = this.agendamento.resultado.pessoa;
    this.relacionados = this.agendamento.resultado.relacionados;
    this.maximoPorAgendamento = this.agendamento.maximoPorAgendamento;
    this.diasPenalidade = this.agendamento.diasPenalidade;
  }

  stepFourSubmit(event, form: NgForm) {
    event.preventDefault();
    event.stopPropagation();
    if (this.selecionados.length === 0) {
      this.showErrorUsuariosObrigatorios();
    } else if (form.valid) {
      const titularSelecionado = !!this.selecionados.find(
        pessoa => this.titular && this.titular.pessoa == pessoa
      );
      const consulta = {
        consultaPorTilular: titularSelecionado,
        orgaoId: this.agendamento.orgaoId,
        pessoa: {
          ...this.requerente,
          selecao: titularSelecionado
        },
        primeiroResultado: 0,
        servicoId: this.idServico,
        tamanhoPagina: 999,
        totalResultados: 999,
        relacionados: this.dependentes
          .filter(i => !!i && this.selecionados.indexOf(i.pessoa) > -1)
          .map(info => ({
            ...info.pessoa,
            selecao: true
          }))
      };
      const naoComparecidos = this.agendamento.getAgendamentosNaoComparecidos(
        consulta
      );
      const abertos = this.agendamento.getAgendamentosAbertos(consulta);
      return Observable.forkJoin([naoComparecidos, abertos]).subscribe(
        ([naoComparecidos, abertos, ...rest]) => {
          if (naoComparecidos && naoComparecidos.length > 0) {
            if (
              naoComparecidos.length == 1 &&
              naoComparecidos[0].id == this.agendamento.getResultado().id
            ) {
              this.fillParticipantes();
              this.navCtrl.push(AgendamentoStepFivePage);
            } else {
              this.alert.showAgendamentoAnteriores(
                `Agendamentos Não comparecidos (penalidade de ${
                  this.diasPenalidade
                } dias)`,
                "Não é possível realizar um novo agendamento quando já existem agendamentos abertos e/ou não comparecidos recentemente.",
                naoComparecidos
              );
            }
          } else if (abertos && abertos.length > 0) {
            if (
              abertos.length == 1 &&
              abertos[0].id == this.agendamento.getResultado().id
            ) {
              this.fillParticipantes();
              this.navCtrl.push(AgendamentoStepFivePage);
            } else {
              this.alert.showAgendamentoAnteriores(
                "Agendamentos Abertos",
                "Não é possível realizar um novo agendamento quando já existem agendamentos abertos e/ou não comparecidos recentemente.",
                abertos
              );
            }
          } else {
            this.fillParticipantes();
            this.navCtrl.push(AgendamentoStepFivePage);
          }
        },
        () => {
          this.showErroInesperado();
        }
      );
    } else {
      this.showErroCamposObrigatorios();
    }
  }

  private showErrorUsuariosObrigatorios() {
    this.alert.showError({
      subTitle: "Usuários Obrigatórios.",
      msg: `*Selecione pelo menos um usuário.`,
      buttons: [
        {
          text: "OK"
        }
      ]
    });
  }

  private showErroCamposObrigatorios() {
    this.alert.showError({
      subTitle: "Campos Obrigatórios.",
      msg: `*Preencha as informações adicionais obrigatórias.`,
      buttons: [
        {
          text: "OK"
        }
      ]
    });
  }

  private showErroInesperado() {
    this.alert.showError({
      subTitle: "Erro.",
      msg: `*Erro inesperado, por favor tente novamente.`,
      buttons: [
        {
          text: "OK"
        }
      ]
    });
  }

  fillParticipantes() {
    this.agendamento.setRelacionados([]);
    this.agendamento.setParticipacaoTitular(null);
    const relacionados = this.dependentes
      .filter(i => !!i && this.selecionados.indexOf(i.pessoa) > -1)
      .map(info => ({
        ...info.pessoa,
        infoAdicionaisDTO: {
          informacoesAdicionais: info.infoAdicionais.map(i => ({
            dependente: {
              id: info.pessoa.id,
              portadorDeficiencia: info.pessoa.portadorDeficiencia
            },
            informacaoAdicional: i.original,
            valor: i.value
          })),
          valoresValidos: true
        }
      }));
    this.agendamento.setRelacionados(relacionados);
    if (this.titular) {
      const infosAdicionaisAgendamentos = this.titular.infoAdicionais.map(
        i => ({
          agendamento: {},
          valor: i.value,
          informacaoAdicional: i.original
        })
      );
      const titularSelecionado = !!this.selecionados.find(
        pessoa => this.titular && this.titular.pessoa == pessoa
      );
      this.agendamento.setParticipacaoTitular(
        infosAdicionaisAgendamentos,
        titularSelecionado
      );
    }
  }

  onSelectPessoa(event) {
    if (this.selecionados.length >= this.maximoPorAgendamento) {
      this.alert.showError({
        subTitle: "Máximo de usuários.",
        msg: `*Só serão permitidos ${
          this.maximoPorAgendamento
        } usuários por agendamento.`,
        buttons: [
          {
            text: "OK"
          }
        ]
      });
    } else {
      this.selecionados.push(event);
    }
  }
  onUnselectPessoa(event) {
    const idx = this.selecionados.indexOf(event);
    if (idx > -1) {
      this.selecionados.splice(idx, 1);
    }
  }
  isSelected(pessoa) {
    return this.selecionados.indexOf(pessoa) > -1;
  }

  voltar() {
    this.navCtrl.pop();
  }

  onTitular(val) {
    this.titular = val;
  }
}
