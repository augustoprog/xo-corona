import { Component } from "@angular/core";
import {
  IonicPage,
  ModalController,
  NavController,
  NavParams
} from "ionic-angular";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { Relacionado } from "../../../providers/agendamento/model";
import { AlertProvider } from "../../../providers/alert/alert";
import { applyMask, cpfMask, endSession, isLogged } from "../../../util/common";
import { AgendamentoDependentePage } from "../agendamento-dependente/agendamento-dependente";
import { AgendamentoStepFourPage } from "../agendamento-step-four/agendamento-step-four";

/**
 * Generated class for the AgendamentoStepThreePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-step-three",
  templateUrl: "agendamento-step-three.html"
})
export class AgendamentoStepThreePage {
  dependentes: Relacionado[] = [];
  applyMask = applyMask;
  cpfMask = cpfMask;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private agendamento: AgendamentoProvider,
    private alert: AlertProvider
  ) {
    console.log(this.navParams.data);
    console.log(this.agendamento.getNovosDependentes());
    this.dependentes = this.agendamento
      .getNovosDependentes()
      .filter(d => d.id === null || d.id === undefined);
  }

  ionViewDidLoad() {
    if (isLogged()) {
      this.agendamento.getDependentes().subscribe(
        (data: Relacionado[]) => {
          this.dependentes.push(...data);
        },
        error => {
          endSession(this.navCtrl, this.alert, error);
        }
      );
    }
  }

  showModalDependente(data: { dependente: any; edit: boolean; id: number }) {
    const cpf = this.agendamento.getResultado().pessoa.cpf;
    const modal = this.modalCtrl.create(AgendamentoDependentePage, {
      ...data,
      cpf
    });
    modal.onDidDismiss(({ dependente, edit, id }) => {
      if (dependente) {
        if (dependente.cpf) {
          dependente.cpf = dependente.cpf.replace(/\D+/g, "");
        }

        if (edit === true) {
          this.dependentes.splice(id, 1);
        }
        //tira da lista todos com o cpf do dependente novo/editado
        this.dependentes = this.dependentes.filter(d =>
          dependente.cpf ? d.cpf !== dependente.cpf : true
        );
        this.dependentes.push({
          infoAdicionaisDTO: {
            informacoesAdicionais: [],
            valoresValidos: true
          },
          ...dependente,
          cidadao: this.agendamento.getResultado().pessoa.cidadao
        });
        console.log("%c dependentes", "color:red");
        console.log(this.dependentes);
        console.log(this);
        this.agendamento.setNovosDependentes(
          this.dependentes.filter(d => d.id === null || d.id === undefined)
        );
        console.log(this.agendamento.getNovosDependentes());
      }
    });
    modal.present();
  }

  remove(data: Relacionado) {
    if (data) {
      this.dependentes = this.dependentes.filter(dep => data !== dep);
    }
  }

  edit(data: Relacionado) {
    if (data) {
      this.showModalDependente({
        dependente: { ...data },
        edit: true,
        id: this.dependentes.indexOf(data)
      });
    }
  }

  voltar() {
    this.navCtrl.pop();
  }

  avancar() {
    this.agendamento.setRelacionados(this.dependentes);
    this.navCtrl.push(AgendamentoStepFourPage);
  }
}
