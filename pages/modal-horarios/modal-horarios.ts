import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  IonicPage,
  Loading,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { AgendamentoProvider } from "../../providers/agendamento/agendamento";
import { HorarioAgenda } from "../../providers/agendamento/model";
import { AlertProvider } from "../../providers/alert/alert";
import { endSession, formatHour } from "../../util/common";

/**
 * Generated class for the ModalHorariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-modal-horarios",
  templateUrl: "modal-horarios.html"
})
export class ModalHorariosPage {
  loader: Loading;
  items = [];

  selectedDate: Date;
  unidadesId: number[];

  page: number = 0;
  pageSize: number = 20;
  totalItems: number;

  formatHour = formatHour;

  checkList: Array<boolean> = new Array<boolean>();

  selectedHorarios: Array<HorarioAgenda> = new Array<HorarioAgenda>();

  horas: Array<HorarioAgenda> = new Array<HorarioAgenda>();

  totalHorario: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private agendamentoProvider: AgendamentoProvider,
    private alert: AlertProvider
  ) {
    this.page = 0;

    this.selectedDate = navParams.get("selectedDate");
    this.unidadesId = navParams.get("unidadeIds");

    this.onCallPage();

    this.totalHorario = this.agendamentoProvider.getTotalHorarios();

    const {
      horariosRelacionados = [],
      horarioAgenda
    } = this.agendamentoProvider.getResultado();
    this.selectedHorarios = [...horariosRelacionados];
    if (!!horarioAgenda.horario) this.selectedHorarios.push(horarioAgenda);
    this.sortSelectedHorarios();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalHorariosPage");
  }

  dismiss(horarios) {
    this.viewCtrl.dismiss(horarios);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  doInfinite(infiniteScroll) {
    this.page++;
    console.log("Begin async operation", this.page);
    this.onCallPage(infiniteScroll);
  }

  setHorarios() {
    if (this.selectedHorarios.length == this.totalHorario) {
      if (this.isHorariosConjugados()) {
        this.dismiss(this.selectedHorarios);
      } else {
        this.alert.showWarning({
          subTitle: "Atenção.",
          msg: `Os horários precisam ser selecionados em sequencia.`,
          buttons: [
            {
              text: "OK"
            }
          ]
        });
      }
    } else {
      this.alert.showWarning({
        subTitle: "Atenção.",
        msg: `Favor selecionar um total de ${this.totalHorario} horário(s).`,
        buttons: [
          {
            text: "OK"
          }
        ]
      });
    }
  }

  isHorariosConjugados() {
    if (this.totalHorario == 1 && this.selectedHorarios.length == 1)
      return true;

    for (let i = 1; i < this.selectedHorarios.length; i++) {
      const prev: HorarioAgenda = this.selectedHorarios[i - 1];
      const current: HorarioAgenda = this.selectedHorarios[i];
      if (Math.abs(current.id - prev.id) != 1) {
        return false;
      }
    }

    return true;
  }

  onCallPage(infiniteScroll?) {
    // if (this.horas.length != 0 && this.horas.length == this.totalItems) {
    //   console.log("Enabled false");
    //   infiniteScroll.enable(false);
    //   console.log(infiniteScroll);
    // }

    if (this.page == 0) {
      this.agendamentoProvider.present();
    }

    this.agendamentoProvider
      .getHorariosAgendamento({
        primeiroResultado: this.page * this.pageSize,
        servicoId: this.agendamentoProvider.getResultado().horarioAgenda
          .servicoUnidade.servico.id,
        unidadeIds: this.unidadesId,
        tamanhoPagina: this.pageSize,
        entidadeConsulta: {},
        totalResultados: 0,
        data: this.selectedDate
      })
      .subscribe(
        data => {
          if (infiniteScroll) {
            console.log("complete");
            infiniteScroll.complete();
          }

          if (this.page == 0) {
            this.agendamentoProvider.dismiss();
          }

          if (data) {
            this.horas = this.horas.concat(data.resultado);
            this.checkList = this.checkList.concat(
              new Array<boolean>(data.resultado.length)
            );

            if (!this.totalItems) {
              this.totalItems = data.totalResultados;
            }
          }
        },
        (error: HttpErrorResponse) => {
          this.agendamentoProvider.dismiss();
          endSession(this.navCtrl, this.alert, error);
        }
      );
  }

  onChangeCheck(event, index) {
    console.log(event.checked, index);
    if (event.checked) {
      if (this.selectedHorarios.length == this.totalHorario) {
        event.checked = false;
        this.alert.showWarning({
          subTitle: "Atenção.",
          msg: `Você não pode selecionar mais que ${
            this.totalHorario
          } horário(s).`,
          buttons: [
            {
              text: "OK"
            }
          ]
        });
      } else {
        this.selectedHorarios.push(this.horas[index]);
        this.sortSelectedHorarios();
      }
    } else {
      this.selectedHorarios = this.selectedHorarios.filter(
        item => item.id != this.horas[index].id
      );
    }
  }

  private sortSelectedHorarios() {
    this.selectedHorarios.sort(function(a, b) {
      return a.id - b.id;
    });
  }

  isHorarioSelected(horario) {
    return this.selectedHorarios.some(h => h.id === horario.id);
  }
}
