import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";
import { Component, ViewChild } from "@angular/core";
import { Http } from "@angular/http";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  LoadingController,
  Loading,
  ActionSheetController,
  Content
} from "ionic-angular";
import { ModalOcupacaoPage } from "./../modal-ocupacao/modal-ocupacao";
import "rxjs/add/operator/map";
import { isInvalidModel, getErrorMessage } from "../../util/common";
import { UsuarioCadastroService } from "./usuario-cadastro-service";
import { CameraOptions, Camera } from "@ionic-native/camera";
import { AlertProvider } from "../../providers/alert/alert";
import { ModalMunicipioPage } from "../modal-municipio/modal-municipio";
import { KeycloakService } from "../../keycloak";
import { LoginPage } from "../login/login";
import { HttpErrorResponse } from "@angular/common/http";

@IonicPage()
@Component({
  selector: "page-usuario-cadastro",
  templateUrl: "usuario-cadastro.html"
})
export class UsuarioCadastroPage {
  loader: Loading;
  niveisInstrucaoFull: any;
  coresRacasFull: any;
  municipiosFull: any;
  user: User = <User>{ ocupacao: {}, nivelInstrucao: {} };
  @ViewChild(Content) content: Content;

  isInvalidModel = isInvalidModel;
  public mask = [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/
  ];

  UFs: any[] = [
    "AC",
    "AL",
    "AM",
    "AP",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RO",
    "RS",
    "RR",
    "SC",
    "SE",
    "SP",
    "TO"
  ].sort(function (a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  sexo_ = [
    { value: "F", displayValue: "Feminino" },
    { value: "M", displayValue: "Masculino" }
  ];

  photoUsuario;

  coresRacas: any[];
  niveisInstrucao: any;
  nivelInstrucao: any;
  nivelInstrucaoEscolhida: any;
  param: any;
  ocupacaoEscolhida: any = {};
  uFs: any;
  municipios: any;
  ufsNascimento: any;
  hasMunicipios: boolean = false;

  cidadaoDadosPessoais: any = {};

  id;
  versao;
  nome;
  email;
  cpf;
  dataNascimento;
  nomeMae;
  sexo;
  naturalidadeUf;
  naturalidadeMunicipio;
  corRaca;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private usuarioCadastroService: UsuarioCadastroService,
    public modalCtrl: ModalController,
    private cadCidadaoProvider: CadCidadaoProvider,
    public alertCtrl: AlertController,
    private camera: Camera,
    private alert: AlertProvider,
    private loadingController: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    private keycloakService: KeycloakService
  ) {
    //this.UFs.push({ value: "NA", displayValue: "Outros - Fora do Brasil" });
  }

  ionViewWillEnter() {
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => {
        this.user = cidadao;
        if (this.user.foto === null) {
          this.photoUsuario = "assets/profile/user.png";
        } else {
          this.photoUsuario = `data:image/jpeg;base64,${this.user.foto}`;
        }
        if (!!this.user) {
          let data: string[] = this.user.dataNascimento.split("/");
          this.dataNascimento = new Date(
            Number.parseInt(data[2]),
            Number.parseInt(data[1]) - 1,
            Number.parseInt(data[0])
          ).toISOString();
          this.corRaca = this.user.corRaca ? this.user.corRaca.titulo : null;
          this.nivelInstrucao = this.user.nivelInstrucao
            ? this.user.nivelInstrucao.titulo
            : null;
          if (this.user.naturalidadeUf) {
            this.carregaMunicipios(this.user.naturalidadeUf, true);
          }
        }
      });
    //this.getCidadao();

    this.usuarioCadastroService.getUf().subscribe(
      res => {
        this.uFs = res;
        //console.log(res);
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar a lista de UFs.")
    );

    this.usuarioCadastroService.getCorRaca().subscribe(
      res => {
        this.coresRacas = res.map(data => data.titulo);
        this.coresRacasFull = res;
        // this.coresRacas.map(data => {
        //   return { value: data.id, displayValue: data.titulo };
        // });
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar a lista de cor e raça.")
    );

    //console.log("getNivelInstrucao");
    this.usuarioCadastroService.getNivelInstrucao().subscribe(
      res => {
        this.niveisInstrucao = res.map(i => i.titulo);
        this.niveisInstrucaoFull = res;
        //console.log(res);
        //console.log("nivel de instrução:", res);
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar a lista nivel de instrção/escolaridade.")
    );
  }

  openModal(param) {
    let modal = this.modalCtrl.create(ModalOcupacaoPage, param);
    modal.onDidDismiss(data => {
      //console.log(data);
      if (data) {
        this.user.ocupacao = data;
      }
    });
    modal.present();
  }

  openModalMunicipios(param) {
    if (!this.hasMunicipios) {
      return;
    }
    let modal = this.modalCtrl.create(ModalMunicipioPage, {
      uf: param,
      municipios: this.municipios
    });
    modal.onDidDismiss(data => {
      //console.log(data);
      if (data) {
        this.user.naturalidadeMunicipio = data;
      }
    });
    modal.present();
  }

  getCorRaca(selected) {
    for (const key in this.coresRacasFull) {
      if (this.coresRacasFull[key].titulo == selected) {
        return this.coresRacasFull[key];
      }
    }
    return null;
  }

  getNivelInstrucao(selected) {
    for (const key in this.niveisInstrucaoFull) {
      if (this.niveisInstrucaoFull[key].titulo == selected) {
        return this.niveisInstrucaoFull[key];
      }
    }
    return null;
  }

  abrirFoto() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Foto do Perfil",
      buttons: [
        {
          text: "Camera",
          //role: "destructive",
          handler: () => {
            let options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              allowEdit: true,
              targetWidth: 113,
              targetHeight: 151
            };
            this.chamarCamera(options);
          }
        },
        {
          text: "Galeria",
          handler: () => {
            let options: CameraOptions = {
              quality: 100,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              allowEdit: true,
              targetWidth: 113,
              targetHeight: 151
            };
            this.chamarCamera(options);
          }
        },
        {
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            ////console.log("Cancel clicked");
          }
        }
      ]
    });

    actionSheet.present();
  }

  chamarGaleria() { }

  chamarCamera(options) {
    this.camera.getPicture(options).then(
      imageData => {
        this.user.foto = imageData;
        this.photoUsuario = `data:image/jpeg;base64,${imageData}`;
      }
    );
  }

  atualizaFotoBd(objUpdFoto) {
    //alert('chegou em atualizaFotoBD');

    this.cadCidadaoProvider.setFoto(objUpdFoto)
      .subscribe(cidadao => {
        //alert('Foto Atualizada !!!');
        //console.log("Foto Atualizada com sucesso");

        ////console.log(res);

        this.photoUsuario = `data:image/jpeg;base64,${cidadao.foto}`;
      },
        error => this.tratarErroServico(error, "Erro ao tentar atualizar foto.")
      );

    //alert('depois de foto');
  }

  carregaMunicipios(uf, init = false) {
    //console.log("uf:", uf);
    this.usuarioCadastroService.getMunicipio(uf).subscribe(
      res => {
        this.municipios = res.map(i => i.nome);
        this.municipiosFull = res;
        this.hasMunicipios = true;
        if (!init) {
          this.user.naturalidadeMunicipio = null;
        }
      },
      error => {
        this.hasMunicipios = false;
        this.tratarErroServico(error, "Erro ao tentar recuperar a lista de UFs.");
      }
    );
  }

  getCidadao() {
    this.cadCidadaoProvider.getCidadao().subscribe(
      res => {
        //console.log("getCidadao:", JSON.stringify(res));

        this.id = res.id;
        this.versao = res.versao;
        this.nome = res.nome;
        this.email = res.email;

        for (let item of res.documentos) {
          //alert(item.tipoDocumento.titulo);
          if (item.tipoDocumento.titulo == "CPF") {
            //alert(JSON.parse(item.json).cpf);

            let cpfLimpo = JSON.parse(item.json).cpf.replace(".", "");
            cpfLimpo = cpfLimpo.replace(".", "");
            cpfLimpo = cpfLimpo.replace("-", "");

            this.cpf = cpfLimpo;

            //console.log("xxx cpf = " + this.cpf);
          }
        }

        if (
          res.dataNascimento == null ||
          res.dataNascimento == "" ||
          res.dataNascimento == "null"
        ) {
          let today = new Date();
          let dd = today.getDate();
          let mm = today.getMonth() + 1; //January is 0!
          let yyyy = today.getFullYear();

          this.dataNascimento = dd + "/" + mm + "/" + yyyy;
        } else {
          this.dataNascimento =
            res.dataNascimento.substr(6, 4) +
            "-" +
            res.dataNascimento.substr(3, 2) +
            "-" +
            res.dataNascimento.substr(0, 2);
        }
        //alert('this.dataNascimento= '+ this.dataNascimento + '\n'+ res.dataNascimento.substr(6,4)+'-'+res.dataNascimento.substr(3,2)+'-'+res.dataNascimento.substr(0,2));

        this.nomeMae = res.nomeMae;
        this.sexo = res.sexo;
        this.naturalidadeUf = res.naturalidadeUf;
        this.carregaMunicipios(this.naturalidadeUf);
        this.naturalidadeMunicipio = res.naturalidadeMunicipio;
        if (res.corRaca) {
          this.corRaca = res.corRaca.id;
        } else {
          this.corRaca = null;
        }

        ////console.log('res.corRaca = ',res.corRaca);

        if (res.ocupacao) {
          this.ocupacaoEscolhida.titulo = res.ocupacao.titulo;
          this.ocupacaoEscolhida.id = res.ocupacao.id;
        } else {
          this.ocupacaoEscolhida.titulo = null;
          this.ocupacaoEscolhida.id = null;
        }

        if (res.nivelInstrucao) {
          this.nivelInstrucaoEscolhida = res.nivelInstrucao.id;
        } else {
          this.nivelInstrucaoEscolhida = null;
        }

        //
      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar Cidadão Logado getCidadao.")
    );
  }

  removeOcupacao($event) {
    this.user.ocupacao = null;
    $event.stopPropagation();
    return false;
  }

  removeMunicipio($event) {
    this.user.naturalidadeMunicipio = null;
    $event.stopPropagation();
    return false;
  }

  removeCorRaca($event) {
    this.corRaca = null;
    //console.log(this.corRaca);
    this.user.corRaca = null;
  }

  removeSexo($event) {
    this.user.sexo = null;
    console.log(this.user.sexo);
  }

  salvarDadosPessoais(form) {
    //console.log("dadosPessoais: ", this.cidadaoDadosPessoais);
    //console.log(this.cidadaoDadosPessoais);
    window.localStorage.setItem(
      "lixo",
      JSON.stringify(this.cidadaoDadosPessoais)
    );

    if (!form.valid) {
      this.alert.showError({
        subTitle: "Atenção.",
        msg: "Preencha todos os campos obrigatórios.",
        buttons: [{ text: "ok" }]
      });
      return;
    }
    let data: Date = new Date(this.dataNascimento);
    this.user.dataNascimento =
      data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
    this.user.nivelInstrucao = this.getNivelInstrucao(this.nivelInstrucao);
    this.user.corRaca = this.getCorRaca(this.corRaca);
    this.user.cpf = this.user.cpf.replace(/\.|\-/g, '');
    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();
    if (typeof this.user.sexo == "object") {
      this.user.sexo = null;
    }
    this.cadCidadaoProvider.setDadosPessoais(this.user).subscribe(
      res => {

        this.user = res;
        let mensagem = "Dados pessoais salvos com sucesso!";
        this.loader.dismiss();
        this.alert.showSuccess({
          subTitle: "Sucesso!",
          msg: mensagem,
          buttons: [{ text: "ok" }]
        });

        this.navCtrl.pop();
      },
      error => this.tratarErroServico(error)
    );
  }

  fixMask(mask: any[], text: string) {
    if (!!text && typeof text === 'string') {
      return text.substr(0, mask.length);
    }
    return text;
  }

  fixScroll() {
    setTimeout(() => {
      document.activeElement.scrollIntoView({ block: "center" });
    }, 350);
  }

  private tratarErroServico(e: any, title?: string) {
    if (!!this.loader && !!this.loader.dismiss) {
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

declare interface User {
  id: number;
  idKeycloak: string;
  nome: string;
  dataNascimento: string;
  maeDesconhecida: boolean;
  nomeMae: string;
  foto: string;
  email: string;
  emailAlternativo: string;
  cpf: string;
  rg: string;
  orgaoExpedidor: string;
  ufRG: string;
  ocupacao: any;
  nivelInstrucao: any;
  corRaca: any;
  naturalidadeUf: any;
  naturalidadeMunicipio: any;
  sexo: any;
}
