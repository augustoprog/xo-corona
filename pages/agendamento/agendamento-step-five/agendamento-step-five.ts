import { HttpErrorResponse } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation";
import { CalendarComponentOptions, DefaultDate } from "ion2-calendar";
import {
  Content,
  IonicPage,
  ModalController,
  NavController,
  NavParams
} from "ionic-angular";
import * as moment from "moment";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import {
  HorarioAgenda,
  Resultado,
  UnidadeAtendimento
} from "../../../providers/agendamento/model";
import { AlertProvider } from "../../../providers/alert/alert";
import {
  doubleDigit,
  endSession,
  formatHour,
  parseString2Date
} from "../../../util/common";
import { ModalHorariosPage } from "../../modal-horarios/modal-horarios";
import { AgendamentoConfirmarPage } from "../agendamento-confirmar/agendamento-confirmar";

/**
 * Generated class for the AgendamentoStepFivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-step-five",
  templateUrl: "agendamento-step-five.html"
})
export class AgendamentoStepFivePage {
  selectedMunicipio: any = null;
  municipios: any[] = [];

  selectedUnidade: any = null;
  unidades: any[] = [];

  selectedHorarios: HorarioAgenda[] = null;

  date: any;
  type: DefaultDate = "js-date"; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  //_disableWeeks: number[] = [0, 6];
  options: CalendarComponentOptions = null;

  formatHour = formatHour;

  antigo: Resultado = null;
  novo: Resultado = null;

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public agendamentoProvider: AgendamentoProvider,
    public geolocation: Geolocation,
    public alert: AlertProvider
  ) {
    moment.locale("pt-br");
  }

  formatUnidadeAtendimento(param: UnidadeAtendimento) {
    let unidade = `${param.nome} - ${param.endereco.logradouro}${
      param.endereco.numero ? " " + param.endereco.numero : ""
    }${this.get(param.endereco.complemento)}${this.get(
      param.endereco.bairro
    )}${this.get(param.endereco.municipio)}`;
    return unidade;
  }

  get(param) {
    if (param) {
      return `, ${param.trim()}`;
    }
    return "";
  }

  ionViewWillEnter() {
    //console.log(this.agendamentoProvider.getResultado());

    if (this.agendamentoProvider.getResultado().id) {
      this.antigo = JSON.parse(
        JSON.stringify(this.agendamentoProvider.getResultado())
      );
    }
    this.agendamentoProvider
      .getMunicipioByServico(
        this.agendamentoProvider.getResultado().horarioAgenda.servicoUnidade
          .servico.id
      )
      .subscribe(
        data => {
          this.municipios = data;
          this.agendamentoProvider.present();
          this.geolocation
            .getCurrentPosition({
              timeout: 10000,
              enableHighAccuracy: true,
              maximumAge: 3600
            })
            .then(resp => {
              // resp.coords.latitude
              // resp.coords.longitude

              if (!this.agendamentoProvider.getResultado().id) {
                this.agendamentoProvider
                  .getAdressByLatLong(
                    resp.coords.latitude,
                    resp.coords.longitude
                  )
                  .finally(() => {
                    this.agendamentoProvider.dismiss();
                  })
                  .subscribe(data => {
                    if (data && this.isCityInMonicipios(data.address.city)) {
                      this.selectedMunicipio = data.address.city;
                      this.changeMunicipio(this.selectedMunicipio);
                    }
                  });
              } else {
                this.agendamentoProvider.dismiss();
                this.configurePage();
              }
            })
            .catch(error => {
              console.log(error);
              this.agendamentoProvider.dismiss();
              this.configurePage();
            });
        },
        error => {
          console.log(error);
          endSession(this.navCtrl, this.alert, error);
        }
      );
  }

  configurePage() {
    if (
      this.agendamentoProvider.getResultado().horarioAgenda &&
      this.agendamentoProvider.getResultado().horarioAgenda.servicoUnidade &&
      this.agendamentoProvider.getResultado().horarioAgenda.servicoUnidade
        .unidadeAtendimento
    ) {
      this.selectedMunicipio = this.agendamentoProvider.getResultado().horarioAgenda.servicoUnidade.unidadeAtendimento.endereco.municipio;
      this.changeMunicipio(this.selectedMunicipio);
      this.selectedUnidade = this.agendamentoProvider.getResultado().horarioAgenda.servicoUnidade.unidadeAtendimento.id;
      this.changeUnidade(this.selectedUnidade);

      this.date = this.formantDate(
        new Date(this.agendamentoProvider.getResultado().horarioAgenda.horario)
      );

      // this.date = "2019-01-01";

      this.selectedHorarios = [
        this.agendamentoProvider.getResultado().horarioAgenda
      ];
      if (this.agendamentoProvider.getResultado().horariosRelacionados) {
        this.agendamentoProvider.getResultado().horariosRelacionados = this.agendamentoProvider
          .getResultado()
          .horariosRelacionados.slice(
            0,
            this.agendamentoProvider.getTotalHorarios() - 1
          );
      }
      if (this.agendamentoProvider.getResultado().horariosRelacionados) {
        this.selectedHorarios = this.selectedHorarios.concat(<any>(
          this.agendamentoProvider.getResultado().horariosRelacionados
        ));
      }
    }
  }

  ionViewDidLoad() {}

  isCityInMonicipios(param: string) {
    return this.municipios.indexOf(param) != -1;
  }

  changeMunicipio(event) {
    if (event) {
      this.selectedUnidade = null;
      this.selectedHorarios = null;

      let param = {
        idServico: this.agendamentoProvider.getResultado().horarioAgenda
          .servicoUnidade.servico.id,
        municipios: [event]
      };
      this.agendamentoProvider
        .getUnidadesDeAtendimentoComAgenda(param)
        .subscribe(data => {
          this.unidades = data.map(item => {
            return { displayValue: item.nome, value: item.id };
          });
        });
    }
  }

  formantDate = (date): string => {
    if (!date) return "";
    console.log(date);
    return `${date.getFullYear()}-${doubleDigit(
      date.getMonth() + 1
    )}-${doubleDigit(date.getDate())}`;
  };

  changeUnidade(event) {
    this.selectedHorarios = null;
    this.date = null;
    if (event) {
      this.agendamentoProvider
        .getDatasAgendamento({
          primeiroResultado: 0,
          servicoId: this.agendamentoProvider.getResultado().horarioAgenda
            .servicoUnidade.servico.id,
          unidadeIds: [event],
          tamanhoPagina: 10,
          entidadeConsulta: {},
          totalResultados: 0
        })
        .subscribe(
          data => {
            //console.log(data);

            let days: any[] = [];

            for (let index = 0; index < data.datas.length; index++) {
              const element = data.datas[index];
              days.push({
                date: parseString2Date(element),
                disable: true,
                cssClass: "day-disabled"
              });
            }
            console.log("before");
            this.options = {
              weekdays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
              daysConfig: days,
              showMonthPicker: false,
              monthFormat: "MMMM YYYY",
              from: parseString2Date(data.dataInicial),
              to: parseString2Date(data.dataFinal)
            };
            console.log("after");
            this.content.scrollToBottom();
          },
          (error: HttpErrorResponse) => {
            endSession(this.navCtrl, this.alert, error);
          }
        );
    }
  }

  onChange(event) {
    if (event) {
      this.openModalMaisHorarios(event);
    }
  }

  voltar() {
    this.navCtrl.pop();
    //this.agendamentoProvider.getResultado().horarioAgenda = null;
  }

  openModalMaisHorarios(data: any) {
    console.log(data);
    const { horario } = this.agendamentoProvider.getResultado().horarioAgenda;
    if (horario) {
      if (typeof data == "string") {
        let d: string[] = data.split("-");
        console.log(d, parseInt(d[0]), parseInt(d[1]), parseInt(d[2]));
        data = new Date(parseInt(d[0]), parseInt(d[1]) - 1, parseInt(d[2]));
        console.log("parse", data);
      }
      const dataHorario = new Date(horario);
      if (
        dataHorario.getDate() !== data.getDate() ||
        dataHorario.getFullYear() !== data.getFullYear() ||
        dataHorario.getMonth() !== data.getMonth()
      ) {
        this.clearAgentamento();
      }
    }
    let modal = this.modalCtrl.create(ModalHorariosPage, {
      selectedDate: data,
      unidadeIds: [this.selectedUnidade]
    });
    modal.onDidDismiss(dataRetorno => {
      if (dataRetorno != null) {
        this.selectedHorarios = dataRetorno;
      } else {
        //this.date = null;
        //this.selectedHorarios = [];
        //this.clearAgentamento();
      }
      if (this.selectedHorarios && this.selectedHorarios.length != 0) {
        this.agendamentoProvider.getResultado().horarioAgenda = this.selectedHorarios[0];
        if (this.selectedHorarios.length > 1) {
          this.agendamentoProvider.getResultado().horariosRelacionados = this.selectedHorarios.slice(
            1,
            this.selectedHorarios.length
          );
        }
      }

      var id = setTimeout(() => {
        this.content.scrollToBottom();
        clearTimeout(id);
      }, 100);

      //console.log(this.agendamentoProvider.getResultado());
    });
    modal.present();
  }

  private clearAgentamento() {
    this.agendamentoProvider.getResultado().horariosRelacionados = [];
    this.agendamentoProvider.getResultado().horarioAgenda.id = null;
    this.agendamentoProvider.getResultado().horarioAgenda.versao = null;
    this.agendamentoProvider.getResultado().horarioAgenda.horario = null;
    this.agendamentoProvider.getResultado().horarioAgenda.duracao = null;
    this.agendamentoProvider.getResultado().horarioAgenda.agendaUnidade = null;
    this.agendamentoProvider.getResultado().horarioAgenda.vagas = null;
  }

  reservar() {
    if (!(this.selectedHorarios && this.selectedHorarios.length != 0)) {
      this.alert.showWarning({
        subTitle: "Atenção.",
        msg:
          "Favor selecione horários para todos os participantes do agendamento.",
        buttons: [
          {
            text: "OK"
          }
        ]
      });
      return;
    }

    if (!this.hasChangedHorarios()) {
      this.alert.showWarning({
        subTitle: "Atenção.",
        msg:
          "Para reagendar um serviço é necessário selecionar horário(s) diferente(s) do agendamento anterior.",
        buttons: [
          {
            text: "OK"
          }
        ]
      });
      return;
    }

    const agendamento = {
      novoAgendamento: this.agendamentoProvider.getResultado(),
      agendamentoAnterior: {}
    };

    if (this.antigo) {
      agendamento.agendamentoAnterior = this.antigo;
    }

    if (
      this.selectedHorarios &&
      this.agendamentoProvider.getTotalHorarios() ==
        this.selectedHorarios.length
    ) {
      this.agendamentoProvider.reservar(agendamento).subscribe(
        data => {
          if (data) {
            this.agendamentoProvider.setResultado(data);
            this.navCtrl.push(AgendamentoConfirmarPage);
          }
        },
        error => {
          endSession(this.navCtrl, this.alert, error);
        }
      );
    } else {
      this.alert.showWarning({
        subTitle: "Atenção.",
        msg:
          "Favor selecione horários para todos os participantes do agendamento.",
        buttons: [
          {
            text: "OK"
          }
        ]
      });
    }
  }

  hasChangedHorarios() {
    if (!this.antigo) return true;

    if (
      this.antigo.horarioAgenda.id !=
      this.agendamentoProvider.getResultado().horarioAgenda.id
    ) {
      return true;
    } else {
      if (
        this.antigo.horariosRelacionados &&
        this.agendamentoProvider.getResultado().horariosRelacionados &&
        this.antigo.horariosRelacionados.length ==
          this.agendamentoProvider.getResultado().horariosRelacionados.length
      ) {
        return false;
      } else {
        return true;
      }
    }
  }
}
