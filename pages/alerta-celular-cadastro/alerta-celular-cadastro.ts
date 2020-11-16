import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Loading
} from "ionic-angular";
import { NgForm } from "@angular/forms";
import {
  tel9Mask,
  applyPhoneMask,
  getErrorMessage
} from "../../util/common";
import {
  AlertaCelularProvider,
  Item
} from "../../providers/alerta-celular/alerta-celular";
import { Sim } from "@ionic-native/sim";
import { AlertProvider } from "../../providers/alert/alert";
import { Device } from "@ionic-native/device";
import { KeycloakService } from "../../keycloak";
import { LoginPage } from "../login/login";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import { HttpErrorResponse } from "@angular/common/http";

declare const cordova: any;
declare const plugins;

@IonicPage()
@Component({
  selector: "page-alerta-celular-cadastro",
  templateUrl: "alerta-celular-cadastro.html"
})
export class AlertaCelularCadastroPage {
  loader: Loading;
  marcas: any[];
  selectedOperadora: any[] = [null, null];
  selectedMarca: any = null;
  operadoras: any;
  chipActiveOne: boolean = true;
  celular: Celular;
  chip: Chip;
  btnLabel: string = "CADASTRAR";
  usuario: any;
  numeros: string[] = ["", ""];
  tel9Mask = tel9Mask;
  simInfo: SimInfo;
  isIOs: boolean = false;

  applyMask = applyPhoneMask;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private alertaService: AlertaCelularProvider,
    private loadingController: LoadingController,
    private sim: Sim,
    private alert: AlertProvider,
    private device: Device,
    private keycloakService: KeycloakService,
  ) {
    this.init();
  }

  init() {
    const observables = [];

    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    observables.push(this.alertaService.getMarcas()
      .catch(error => {
        this.tratarErroServico(error);
        return Observable.of([]);
      })
      .do((data: any[]) => {
        this.marcas = data.map(d => {
          return { displayValue: d.label, option: d };
        });
      }));
    observables.push(this.alertaService.getOperadoras()
      .catch(error => {
        this.tratarErroServico(error);
        return Observable.of([]);
      })
      .do((data: any) => {
        this.operadoras = data.map(data => {
          return { displayValue: data.label, option: data };
        });
      }));

    this.celular = new Celular();
    this.chip = new Chip();
    this.celular.aparelhoIMEI.push({ ...this.chip });
    this.celular.marca = <Item>{ label: "*Marca" };
    this.chip.operadora = <Item>{ label: "*Operadora" };

    let aparelhoId = this.navParams.get("id");
    if (aparelhoId) {
      this.btnLabel = "ATUALIZAR";
      observables.push(this.alertaService.getAparelho(aparelhoId)
        .catch(error => {
          this.tratarErroServico(error);
          return Observable.of({});
        })
        .do(data => {
          this.usuario = data.usuario;
          this.celular = new Celular();
          this.celular.id = data.id;
          this.celular.modelo = data.modelo;
          this.celular.serial = data.serial;
          this.celular.marca = data.marca;
          this.celular.dataOcorrido = data.dataOcorrido;
          this.celular.situacaoAlerta = data.situacaoAlerta;
          this.selectedMarca = data.marca.label;

          if (data.aparelhoIMEI.length == 2) this.chipActiveOne = false;
          data.aparelhoIMEI.forEach((element, index) => {
            let chip = new Chip();
            chip.id = element.id;
            chip.imei = element.imei;
            chip.operadora = element.operadora;
            this.selectedOperadora[index] = element.operadora.label;
            chip.numero = element.numero;
            this.celular.aparelhoIMEI.push(chip);
          });
        }));
    }
    Observable.forkJoin(observables)
      .subscribe(() => {
        this.loader.dismiss();
      });
  }
  getSimInfo() {
    plugins.sim.getSimInfo(
      data => console.log(data),
      data => console.log(data)
    );
    return new Promise<SimInfo>((resolve, reject) => {
      var permissions = cordova.plugins.permissions;

      permissions.hasPermission(permissions.READ_PHONE_STATE, status => {
        if (!status.hasPermission) {
          permissions.requestPermissions(
            permissions.READ_PHONE_STATE,
            status => {
              if (!status.hasPermission) {
                console.log("sem permissao");
                reject();
              } else {
                resolve(this.sim.getSimInfo());
              }
            }
          );
        } else {
          resolve(this.sim.getSimInfo());
        }
      });
    });

    // return this.sim
    //   .hasReadPermission()
    //   .then(info => this.sim.getSimInfo())
    //   .catch(err => {
    //     return this.sim
    //       .requestReadPermission()
    //       .then(() => this.sim.getSimInfo());
    //   });
  }

  usarDadosLocais() {
    //console.log("vai carai");
    //console.log(JSON.stringify(device));
    this.getSimInfo().then(info => {
      this.simInfo = info;

      if (this.simInfo && this.simInfo.cards) {
        this.celular.aparelhoIMEI = [];
        this.simInfo.cards.forEach((card, i) => {
          let chip = new Chip();
          chip.id = card.simSlotIndex.toString();
          chip.imei = card.deviceId;
          chip.numero = "";

          let op = this.getOperadora(card.displayName);
          if (op) {
            this.selectedOperadora[i] = op.displayValue;
          }
          this.celular.aparelhoIMEI.push(chip);
        });
      }
    });
  }

  cadastrarCelular(form: NgForm) {
    if (form.invalid) {
      return false;
    }
    this.successPopup();
  }

  getOperadora(name: string) {
    let ops = this.operadoras.filter(
      o =>
        o.displayValue.indexOf(name) != -1 || name.indexOf(o.displayValue) != -1
    );
    if (ops && ops.length) {
      return ops[0];
    }
  }
  ionViewDidLoad() {
    //console.log(this.device);
    if (this.device != null && this.device.platform == "iOS") {
      this.isIOs = true;
    }
  }

  selectChipOne() {
    this.chipActiveOne = true;
    if (this.celular.aparelhoIMEI.length == 2) {
      this.celular.aparelhoIMEI.splice(1, 1);
    }
  }

  selectChipTwo() {
    this.chipActiveOne = false;
    if (this.celular.aparelhoIMEI.length == 1) {
      this.celular.aparelhoIMEI.push(<Chip>{});
    }
  }

  cancelar() {
    this.navCtrl.pop();
  }

  successPopup() {
    let title =
      "<span class='alert-ico'><span class='mr-auto ml-auto col-3'><img src='assets/images/success_phone.png' /></span></span>";
    let subTitle =
      "<span class='alert-title'>Aparelho cadastrado com sucesso!</span>";

    if (this.selectedMarca != null) {
      let el = this.marcas.filter(data => {
        return data.displayValue == this.selectedMarca;
      });
      if (el && el.length > 0) {
        this.celular.marca = el[0].option;
      }
    }

    for (let i = 0; i < this.selectedOperadora.length; i++) {
      const element = this.selectedOperadora[i];
      if (element) {
        let el = this.operadoras.filter(data => {
          return data.displayValue == element;
        });
        if (el && el.length > 0) {
          if (this.celular.aparelhoIMEI[i]) {
            this.celular.aparelhoIMEI[i].operadora = el[0].option;
          }
        }
      }
    }

    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    if (this.celular.id) {
      this.celular.usuario = this.usuario;
      this.alertaService.putAparelho(this.celular)
        .finally(() => this.loader.dismiss())
        .subscribe(data => {
          const alert = this.alertCtrl.create({
            title: title,
            subTitle:
              "<span class='alert-title'>Aparelho atualizado com sucesso!</span>",
            message: "",
            cssClass: "custom-alert",
            buttons: [
              {
                text: "OK",
                role: "cancel",
                handler: () => {
                  this.navCtrl.pop();
                }
              }
            ]
          });
          alert.present();
        },
          error => this.tratarErroServico(error, "Falha ao atualizar o aparelho.")
        );
    } else {
      this.alertaService.postAparelho(this.celular)
        .finally(() => this.loader.dismiss())
        .subscribe(data => {
          const alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            message: "",
            cssClass: "custom-alert",
            buttons: [
              {
                text: "OK",
                role: "cancel",
                handler: () => {
                  this.navCtrl.pop();
                  ////console.log('ão clicked');
                }
              }
            ]
          });
          alert.present();
        },
          error => this.tratarErroServico(error, "Falha ao cadastrar o aparelho.")
        );
    }
  }

  loaderCount: any[] = new Array();
  present() {
    if (this.loaderCount.length == 0) {
      this.loader = this.loadingController.create({
        content: "Carregando..."
      });
      this.loader.present();
    }
    this.loaderCount.push(true);
  }
  dismiss() {
    this.loaderCount.pop();
    if (this.loaderCount.length == 0) {
      this.loader.dismiss();
    }
  }

  fixMask(mask: any[], text: string) {
    if(!!text && typeof text === 'string') {
      return text.substr(0, mask.length);
    }
    return text;
  }

  private tratarErroServico(e: any, title?: string) {
    if(!!this.loader && !!this.loader.dismiss) {
      this.loader.dismiss();
    }
    if (e instanceof HttpErrorResponse && e.status == 403) {
      this.alert.showError({
        subTitle: title || "Atenção",
        msg: "A sua sessão expirou, favor efetue o login novamente.",
        buttons: [
          {
            text: "OK",
            handler: () => {
              this.keycloakService.logout();
              this.navCtrl.setRoot(LoginPage);
            }
          }
        ]
      });
    } else {
      this.alert.showError({
        subTitle: title || "Erro!",
        msg: getErrorMessage(e),
        buttons: [{ text: "OK" }]
      });
    }
  }
  
}
export class Celular {
  id: string;
  marca: Item;
  modelo: string;
  serial: string;
  aparelhoIMEI: Array<Chip>;
  boletimOcorrencia: string;
  dataAlerta: number;
  dataOcorrido: string;
  situacaoAlerta: number;
  usuario: any;

  constructor() {
    this.marca = new Item();
    this.aparelhoIMEI = new Array<Chip>();
  }
}

export class Chip {
  id: string;
  operadora: Item;
  numero: string;
  imei: string;

  constructor() {
    this.operadora = new Item();
  }
}

interface SimInfo {
  carrierName: string;
  countryCode: string;
  mcc: string;
  mnc: string;
  callState: number;
  dataActivity: number;
  networkType: number;
  phoneType: number;
  simState: number;
  isNetworkRoaming: boolean;
  phoneCount: number;
  activeSubscriptionInfoCount: number;
  activeSubscriptionInfoCountMax: number;
  phoneNumber: string;
  deviceId: string;
  deviceSoftwareVersion: string;
  simSerialNumber: string;
  subscriberId: string;
  cards: Card[];
}

interface Card {
  carrierName: string;
  displayName: string;
  countryCode: string;
  mcc: number;
  mnc: number;
  isNetworkRoaming: boolean;
  isDataRoaming: boolean;
  simSlotIndex: number;
  deviceId: string;
  simSerialNumber: string;
  subscriptionId: number;
}
