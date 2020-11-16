import { Component } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Platform, ToastOptions, ToastController } from "ionic-angular";
import { AlertProvider } from "../../providers/alert/alert";
import { EsqueciSenhaPage } from "../esqueci-senha/esqueci-senha";
import { TabsPage } from "../tabs/tabs";
import { CadastrarPage } from "./../cadastrar/cadastrar";
import { KeycloakService } from "../../keycloak";
import { InfoCadastrarPage } from "../info-cadastrar/info-cadastrar";

@IonicPage()
@Component({
    selector: "page-login",
    templateUrl: "login.html"
})
export class LoginPage {
    public loader;

    login = "";
    senha = "";

    offline: boolean;
    checaRede;

    // Dados do App
    AppName;
    PackageName;
    VersionCode;
    VersionNumber;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public loadingController: LoadingController,
        private splashScreen: SplashScreen,
        public alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private alert: AlertProvider,
        private keycloakService: KeycloakService
    ) {
        this.VersionNumber = "1.0.0";
    }

    logar(form) {
        if (form.invalid) {
            const options: ToastOptions = { duration: 3000 };
            const toast = this.toastCtrl.create(options);
            if (!!form.controls.login.errors) {
                if (form.controls.login.errors['required']) {
                    options.message = 'Preencha o email';
                } else if (form.controls.login.errors['email']) {
                    options.message = 'Endereço de email inválido';
                }
            } else if (!!form.controls.senha.errors && form.controls.senha.errors['required']) {
                options.message = 'Preencha a senha';
            }
            toast.present();
            return;
        }

        this.loader = this.loadingController.create({
            content: "Carregando..."
        });
        this.loader.present();

        this.keycloakService.loginExterno(this.login, this.senha)
            .then((logged: boolean) => {
                this.loader.dismiss();
                if (logged) {
                    window.localStorage.setItem("tipoAcesso", "logado");
                    this.navCtrl.setRoot(TabsPage);
                } else {
                    this.alert.showError({
                        subTitle: 'Erro ao tentar logar.',
                        msg: 'Usuário ou senha não encontrados!',
                        buttons: [{ text: 'ok' }]
                    });
                }
            }, error => {
                this.loader.dismiss();
                let mensagem = JSON.parse(error._body)[0].error;

                this.alert.showError({
                    subTitle: 'Erro ao tentar logar.',
                    msg: mensagem,
                    buttons: [{ text: 'ok' }]
                });
            });
    }

    navHome() {
        const showInfo = !JSON.parse(window.localStorage.getItem('no-show-info-cadastro'));
        if(showInfo) {
            this.navCtrl.push(InfoCadastrarPage);
        } else {
            this.navCtrl.setRoot(CadastrarPage);
        }
    }

    navEsqueciSenha() {
        this.navCtrl.push(EsqueciSenhaPage);
    }

    ionViewDidLoad() {
        this.splashScreen.hide();
    }

    ionViewWillLeave() {
        clearInterval(this.checaRede);
    }

    entrar() {
        let title =
            "<span class='alert-ico'><span class='mr-auto ml-auto'><img src='assets/images/user-anonimous.png' /></span></span>";
        let subTitle = "<span class='alert-title'>Usuário Anônimo</span>";
        let msg =
            "<span class='alert-msg'>Entrar sem login limita o uso de algumas funcionalidades. Você realmente deseja continuar?</span>";
        const alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            message: msg,
            cssClass: "custom-alert",
            buttons: [
                {
                    text: "Sim",
                    handler: () => {
                        window.localStorage.setItem("tipoAcesso", "anonimo");
                        this.navCtrl.setRoot(TabsPage);
                    }
                },
                {
                    text: "Não",
                    role: "cancel"
                }
            ]
        });
        alert.present();
    }
}
