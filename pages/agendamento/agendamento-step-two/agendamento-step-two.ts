import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Requerente } from "../../../components/agendamento-dados-requerente-input/agendamento-dados-requerente-input";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { Pessoa } from "../../../providers/agendamento/model";
import { AlertProvider } from "../../../providers/alert/alert";
import { endSession, getCidadaoLogado } from "../../../util/common";
import { AgendamentoStepThreePage } from "../agendamento-step-three/agendamento-step-three";

/**
 * Generated class for the AgendamentoStepTwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-step-two",
  templateUrl: "agendamento-step-two.html"
})
export class AgendamentoStepTwoPage {
  dinamicoModel: string;
  logado = false;
  camposObrigatorios: string[];
  cidadaoLogado: any;
  existeCadastroPessoa: boolean = false;
  pessoa: Pessoa;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private agendamento: AgendamentoProvider,
    private alert: AlertProvider
  ) {
    this.cidadaoLogado = getCidadaoLogado();
    this.logado = !!this.cidadaoLogado;
  }

  parsePessoaDateWhenDoesNotExist(date: string) {
    const parts = date.split("/");
    const dt = new Date(
      parseInt(parts[2], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[0], 10)
    ).toISOString();
    return dt;
  }

  ionViewDidLoad() {
    const idServico = this.agendamento.resultado.horarioAgenda.servicoUnidade.servico.id.toString();
    if (this.logado) {
      this.agendamento.getPessoaById(this.cidadaoLogado.id).subscribe(data => {
        this.existeCadastroPessoa = !!data;
        this.pessoa = data;
        if (!this.existeCadastroPessoa) {
          this.pessoa = {
            id: null,
            nome: this.cidadaoLogado.nome,
            versao: null,
            cidadao: { id: this.cidadaoLogado.id },
            cpf: this.cidadaoLogado.cpf,
            email: this.cidadaoLogado.email,
            nascimento: this.parsePessoaDateWhenDoesNotExist(
              this.cidadaoLogado.dataNascimento
            ),
            usuarioAlteracao: null,
            telefoneFixo: null,
            telefoneCelular: null
          };
        }
      });
    }
    this.agendamento
      .getDadosServicos(idServico)
      .flatMap(data => {
        return this.agendamento.getCamposContatoObrigatorios(idServico);
      })
      .subscribe(
        data => {
          this.camposObrigatorios = data.tiposContato;
          if (!this.logado && this.agendamento.cpfObrigatorioSemLogin) {
            this.camposObrigatorios.push("CPF");
          }
        },
        error => {
          endSession(this.navCtrl, this.alert, error);
        }
      );
  }

  onNewRequerente(requerente: Requerente) {
    this.agendamento.setPessoa(this.parsePessoa(requerente));
    this.agendamento.getResultado().titularParticipa = true;
    this.navCtrl.push(AgendamentoStepThreePage, { requerente });
  }

  parsePessoa = (requerente: Requerente): Pessoa => ({
    ...this.pessoa,
    nome: requerente.nome,
    nascimento: requerente.dataNascimento,
    email: requerente.email || this.pessoa.email,
    cpf: requerente.cpf ? requerente.cpf.replace(/\D+/g, "") : null,
    telefoneCelular: requerente.celular
      ? requerente.celular.replace(/\D+/g, "")
      : this.pessoa
      ? this.pessoa.telefoneCelular
      : null,
    telefoneFixo: requerente.telefoneFixo
      ? requerente.telefoneFixo.replace(/\D+/g, "")
      : this.pessoa
      ? this.pessoa.telefoneFixo
      : null
  });

  onBack() {
    this.navCtrl.pop();
  }
}
