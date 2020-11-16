import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";
import { AgendamentoProvider } from "../../../providers/agendamento/agendamento";
import { Relacionado } from "../../../providers/agendamento/model";
import { AlertProvider } from "../../../providers/alert/alert";
import { isInvalidModel, tel8Mask, tel9Mask } from "../../../util/common";

/**
 * Generated class for the AgendamentoDependentePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-agendamento-dependente",
  templateUrl: "agendamento-dependente.html"
})
export class AgendamentoDependentePage {
  mask = [
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    ".",
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    ".",
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    "-",
    /[0-9]/,
    /[0-9]/
  ];
  tel9Mask = tel9Mask;
  tel8Mask = tel8Mask;

  dependente: Relacionado = {} as Relacionado;

  isInvalidModel = isInvalidModel;
  minimumDate: Date;
  edit: any;
  id: any;
  cpf: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private agendamento: AgendamentoProvider,
    private alert: AlertProvider
  ) {
    const {
      data: { dependente, edit = false, id, cpf = "" }
    } = this.viewCtrl;
    this.dependente = dependente ? dependente : {};
    this.edit = edit;
    this.id = id;
    this.cpf = cpf;
  }

  onSubmit(event, form) {
    if (form.valid) {
      if (
        this.dependente.cpf && this.cpf.replace(/\D+/g, "") === this.dependente.cpf.replace(/\D+/g, "")
      ) {
        this.alert.showError({
          subTitle: "Falha ao adicionar o dependente.",
          msg: "O CPF é o mesmo do requerente.",
          buttons: [
            {
              text: "OK"
            }
          ]
        });
      } else {
        this.agendamento
          .validarDependente({
            ...this.dependente,
            nascimento: new Date(this.dependente.nascimento as string),
            portadorDeficiencia: false,
            selecao: true
          })
          .subscribe(
            data => {
              this.viewCtrl.dismiss({
                dependente: data,
                edit: this.edit,
                id: this.id
              });
            },
            error => {
              this.alert.showError({
                subTitle: "Falha ao adicionar o dependente.",
                msg: error.error[0].error,
                buttons: [
                  {
                    text: "OK"
                  }
                ]
              });
            }
          );
      }
    }
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AgendamentoDependentePage");
  }
}
