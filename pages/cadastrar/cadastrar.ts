import { Component, ElementRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  DateTime,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  TextInput
} from "ionic-angular";
import { AlertProvider } from "../../providers/alert/alert";
import { getErrorMessage, isInvalidModel, ufs } from "../../util/common";
import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";
import { LoginPage } from "./../login/login";
import { PoliticaPage } from "./../politica/politica";

@IonicPage()
@Component({
  selector: "page-cadastrar",
  templateUrl: "cadastrar.html"
})
export class CadastrarPage {
  public loader;

  cidadao: any;

  nome;
  nomeMae: string;
  email;
  email2: string;
  senha;
  senhaConfirmacao;
  cpf: string;
  cpfExists: boolean = false;
  dataNascimento: string;
  rg: string;
  orgaoExpedidor: string;
  ufRG: string;

  UFs = ufs;
  aceitePolitica = false;
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private cadCidadaoProvider: CadCidadaoProvider,
    public loadingController: LoadingController,
    private alert: AlertProvider
  ) {}

  changeToDate(event) {
    event.target.type = "date";
    event.target.click();
  }

  ionViewDidLoad() {}

  verificaCidadao(cpf: string) {
    if (!!cpf && cpf.match(/^\d{3}\.\d{3}\.\d{3}\-\d{2}/g)) {
      const cpfNumbers = cpf.replace(/\.|\-/g, "");
      this.cadCidadaoProvider.verificaCidadao(cpfNumbers).subscribe(
        (existe: boolean) => {
          this.cpfExists = existe;
          if (this.cpfExists) {
            this.alert.showError({
              subTitle: "CPF inválido",
              msg: "Já existe um cidadão cadastrado com esse CPF",
              buttons: [{ text: "Ok" }]
            });
          }
        },
        error => this.tratarErroServico(error)
      );
    }
  }

  mostrarErroFormInvalido(form: NgForm) {
    const messages: string[] = [];
    if (!!form.controls.nome.errors) {
      if (form.controls.nome.errors["required"]) {
        messages.push("Preencha o nome");
      } else if (form.controls.nome.errors["minlength"]) {
        messages.push("Informe seu nome com no mínimo 3 caracteres");
      }
    } else if (!!form.controls.nomeMae.errors) {
      if (form.controls.nomeMae.errors["required"]) {
        messages.push("Preencha o nome da sua mãe");
      } else if (form.controls.nomeMae.errors["maxlength"]) {
        messages.push("Informe o nome de sua mãe com no máximo 100 caracteres");
      }
    } else if (!!form.controls.cpf.errors) {
      if (form.controls.cpf.errors["required"]) {
        messages.push("Preencha o CPF");
      } else if (!form.controls.cpf.errors["cpf"]) {
        messages.push("CPF inválido");
      }
    } else if (!!form.controls.dataNascimento.errors) {
      if (form.controls.dataNascimento.errors["required"]) {
        messages.push("Preencha a data de nascimento");
      }
    } else if (!!form.controls.email.errors) {
      if (form.controls.email.errors["required"]) {
        messages.push("Preencha o e-mail");
      } else if (form.controls.email.errors["email"]) {
        messages.push("Endereço de e-mail inválido");
      } else if (form.controls.email.errors["minlength"]) {
        messages.push("Informe seu e-mail com no mínimo 3 caracteres");
      }
    } else if (!!form.controls.email2.errors) {
      if (form.controls.email2.errors["required"]) {
        messages.push("Preencha a confirmação de e-mail");
      } else if (!form.controls.email2.errors["validateEquals"]) {
        messages.push("E-mails não conferem");
      }
    } else if (!!form.controls.rg.errors) {
      if (form.controls.rg.errors["required"]) {
        messages.push("Preencha o número do RG");
      } else if (form.controls.rg.errors["maxlength"]) {
        messages.push("O RG pode conter no máximo 20 dígitos");
      }
    } else if (!!form.controls.orgaoExpedidor.errors) {
      if (form.controls.orgaoExpedidor.errors["required"]) {
        messages.push("Preencha o órgão expedidor");
      } else if (form.controls.orgaoExpedidor.errors["maxlength"]) {
        messages.push("O órgão expeditor pode conter no máximo 20 caracteres");
      }
    } else if (!!form.controls.ufRG.errors) {
      if (form.controls.ufRG.errors["required"]) {
        messages.push("Preencha o estado do RG");
      }
    } else if (!!form.controls.senha.errors) {
      if (form.controls.senha.errors["required"]) {
        messages.push("Preencha a senha");
      } else if (form.controls.senha.errors["minlength"]) {
        messages.push("Informe seu senha com no mínimo 3 caracteres");
      }
    } else if (!!form.controls.senhaConfirmacao.errors) {
      if (form.controls.senhaConfirmacao.errors["required"]) {
        messages.push("Preencha a confirmação da senha");
      } else if (!form.controls.senhaConfirmacao.errors["validateEquals"]) {
        messages.push("As senhas não correspondem");
      }
    } else if (
      !!form.controls.aceitePolitica.errors &&
      form.controls.aceitePolitica.errors["required"]
    ) {
      messages.push(
        "É necessário aceitar a Política de Privacidade para realizar o cadastro."
      );
    }

    if (messages.length > 0) {
      this.alert.showError({
        subTitle: "Atenção.",
        msg: messages[0],
        buttons: [{ text: "ok" }]
      });
    }
  }

  cadastrar(form: NgForm) {
    if (form.controls.senhaConfirmacao.value !== form.controls.senha.value) {
      this.alert.showError({
        subTitle: "Atenção.",
        msg: "As senhas não correspondem",
        buttons: [{ text: "ok" }]
      });
      return;
    } else if (form.invalid) {
      this.mostrarErroFormInvalido(form);
      return;
    }

    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();

    let dataN: any = this.dataNascimento.split("-");

    dataN = `${dataN[2]}/${dataN[1]}/${dataN[0]}`;

    this.cidadao = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      confirmacao_senha: this.senhaConfirmacao,
      cpf: this.cpf
        .replace(/\D/, "")
        .split(".")
        .join("")
        .split("-")
        .join(""),
      dataNascimento: dataN,
      rg: this.rg,
      orgaoExpedidor: this.orgaoExpedidor,
      nomeMae: this.nomeMae,
      ufRg: this.ufRG
    };

    this.cadCidadaoProvider.cadastroBasico(this.cidadao).subscribe(
      res => {
        this.alert.showSuccess({
          subTitle: "Usuário cadastrado com sucesso.",
          msg:
            "Foi enviado um email de verificação, após clicar no link do e-mail você poderar logar.",
          buttons: [{ text: "ok" }]
        });
        this.loader.dismiss();
        this.navCtrl.setRoot(LoginPage);
      },
      error => this.tratarErroServico(error)
    );

    //alert('Cadastro simulado...');
    //
  }

  navHome() {
    this.navCtrl.setRoot(LoginPage);
  }

  showPolitica() {
    this.navCtrl.push(PoliticaPage);
  }

  toogle(ev) {
    //alert(ev.checked + '\n' + programaSocialId);
    // // Se ativo
    // if (ev.checked) {
    //   this.aceitePolitica = true;
    // } else {
    //   this.aceitePolitica = false;
    // }
  }

  togglePassword(input: TextInput) {
    console.log(input, "toggle");
    input.type = input.type === "password" ? "text" : "password";
    const el = input.getElementRef().nativeElement as any;
    el.querySelector("input").dispatchEvent(new Event("input"), "");
  }

  hidePassword(input: TextInput) {
    console.log(input, "hide");
    input.type = "password";
  }

  showPassword(input: TextInput) {
    console.log(input, "show");
    input.type = "text";
  }

  tabGoNext(e: KeyboardEvent, next: any) {
    const code = e.keyCode || e.which;
    if (code === 13) {
      e.preventDefault();
      let element = null;
      if (next instanceof TextInput || next instanceof DateTime) {
        element = next.getElementRef().nativeElement;
        element = !element ? null : element.getElementsByTagName("input")[0];
      } else if (next instanceof ElementRef) {
        element = next.nativeElement;
        element = !element ? null : element.getElementsByTagName("input")[0];
      } else {
        element = next;
      }
      if (!!element) {
        element.focus();
      }
    }
  }

  fixMask(mask: any[], text: string) {
    if (!!text && typeof text === "string") {
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
    this.alert.showError({
      subTitle: title || "Erro!",
      msg: getErrorMessage(e),
      buttons: [{ text: "OK" }]
    });
  }
}
