import { UsuarioEnderecoPage } from "./../usuario-endereco/usuario-endereco";
import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";
import { Component } from "@angular/core";
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    Loading
} from "ionic-angular";
import { NgForm } from "@angular/forms";

import { AlertProvider } from "../../providers/alert/alert";
import { getErrorMessage } from "../../util/common";
import { HttpErrorResponse } from "@angular/common/http";
import { LoginPage } from "../login/login";
import { KeycloakService } from "../../keycloak";

@IonicPage()
@Component({
    selector: "page-usuario-endereco-editar",
    templateUrl: "usuario-endereco-editar.html"
})
export class UsuarioEnderecoEditarPage {
    loader: Loading;
    enderecoId;
    cidadaoId;
    endereco: any = [];

    numero;
    complemento;
    versao;
    public mask = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];

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

    //cep;
    //tipoLogradouro;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private cadCidadaoProvider: CadCidadaoProvider,
        private loadingController: LoadingController,
        private alert: AlertProvider,
        private keycloakService: KeycloakService
    ) { }

    ionViewDidLoad() {
        //console.log("ionViewDidLoad UsuarioEnderecoEditarPage");

        if (this.navParams.get("cidadaoId")) {
            this.cidadaoId = this.navParams.get("cidadaoId");
        }

        if (this.navParams.get("enderecoId")) {
            this.enderecoId = this.navParams.get("enderecoId");
            this.getEndereco(this.enderecoId);
        }
    }

    getEndereco(enderecoId) {
        this.loader = this.loadingController.create({
            content: "Carregando..."
        });
        this.loader.present();
        this.cadCidadaoProvider.getEndereco(enderecoId).subscribe(
            res => {
                this.loader.dismiss();
                this.endereco.logradouro = res.logradouro;
                this.endereco.bairro = res.bairro;
                this.endereco.cidade = res.municipio;
                this.endereco.estado = res.siglaUf;
                this.numero = res.numero;
                this.complemento = res.complemento;
                this.endereco.cep = res.cep;
                this.versao = res.versao;
                this.enderecoId = res.id;

                //this.endereco = res;

                //console.log(`retorno do getEndereco(${enderecoId}):`, res);
            },
            error => {
                this.tratarErroServico(error, "Erro ao tentar recuperar o endereço")

                this.endereco.logradouro = "";
                this.endereco.bairro = "";
                this.endereco.cidade = "";
                this.endereco.estado = "";
                this.numero = "";
                this.complemento = "";
            }
        );
    }

    buscarCep() {
        this.loader = this.loadingController.create({
            content: "Carregando..."
        });
        this.loader.present();
        this.cadCidadaoProvider.getEnderecoByCEP(this.endereco.cep).subscribe(
            //this.cepPostMon.consultarCep(this.endereco.cep).subscribe(
            res => {
                this.loader.dismiss();
                this.endereco.logradouro = "";
                this.endereco.bairro = "";
                this.endereco.cidade = "";
                this.endereco.estado = "";
                this.numero = "";
                this.complemento = "";
                if (res) {
                    this.endereco = res;
                    this.endereco.cidade = res.municipio;
                    this.endereco.estado = res.uf;
                } else {
                    this.alert.showError({
                        subTitle: "Falha ao buscar o endereço",
                        msg:
                            "Não foi possível localizar seu endereço, favor preencher manualmente.",
                        buttons: [
                            {
                                text: "ok"
                                // handler: _ => {
                                //   this.navCtrl.pop();
                                // }
                            }
                        ]
                    });
                }
            },
            error => {
                this.tratarErroServico(error, "Erro ao tentar buscar o endereço")

                this.endereco.logradouro = "";
                this.endereco.bairro = "";
                this.endereco.cidade = "";
                this.endereco.estado = "";
                this.numero = "";
                this.complemento = "";
            }
        );

        //console.log("buscarCep....");
    }

    mostrarErroFormInvalido(form: NgForm) {
        if (!!form.controls.cep.errors) {
            if (form.controls.cep.errors['required']) {
                this.alert.showError({
                    subTitle: "Atenção.",
                    msg: "O CEP é obrigatório.",
                    buttons: [{ text: "ok" }]
                });
            }
        } else {
            const messages: string[] = [];            
            if (!!form.controls.logradouro.errors) {
                if (form.controls.logradouro.errors['required']) {
                    messages.push('Preencha o logradouro');
                }
            } else if (!!form.controls.numero.errors) {
                if (form.controls.numero.errors['required']) {
                    messages.push('Preencha o número');
                }
            } else if (!!form.controls.bairro.errors) {
                if (form.controls.bairro.errors['required']) {
                    messages.push('Preencha o bairro');
                }
            } else if (!!form.controls.estado.errors) {
                if (form.controls.estado.errors['required']) {
                    messages.push('Preencha o estado');
                }
            } else if (!!form.controls.municipio.errors) {
                if (form.controls.municipio.errors['required']) {
                    messages.push('Preencha o município');
                }
            }
            
            if(messages.length > 0) {
                this.alert.showError({
                    subTitle: "Atenção.",
                    msg: messages[0],
                    buttons: [{ text: "ok" }]
                });
            }
        }
    }

    salvarEndereco(form: NgForm) {
        if (form.invalid) {
            this.mostrarErroFormInvalido(form);
            return false;
        }

        if (this.enderecoId) {
            let objEndereco = {
                logradouro: this.endereco.logradouro,
                tipoLogradouro: 1,
                bairro: this.endereco.bairro,
                municipio: this.endereco.cidade,
                siglaUf: this.endereco.estado,
                uf: this.endereco.estado,
                cep: this.endereco.cep.split("-").join(""),
                numero: this.numero,
                complemento: this.complemento,
                latitude: "",
                longitude: "",
                flagAtivo: true,
                versao: this.versao,
                id: this.enderecoId
            };

            this.loader = this.loadingController.create({
                content: "Carregando..."
            });
            this.loader.present();
            this.cadCidadaoProvider.putEndereco(objEndereco)
                .subscribe(res => {
                    this.loader.dismiss();

                    let mensagem = "Endereço salvo com sucesso!";

                    this.alert.showSuccess({
                        subTitle: "Sucesso",
                        msg: mensagem,
                        buttons: [{ text: "OK" }]
                    });

                    this.navCtrl.popTo(UsuarioEnderecoPage);
                },
                    error => this.tratarErroServico(error, "Erro ao tentar atualizar o endereço"));
        } else {
            let objEndereco = {
                logradouro: this.endereco.logradouro,
                tipoLogradouro: 1,
                bairro: this.endereco.bairro,
                municipio: this.endereco.cidade,
                siglaUf: this.endereco.estado,
                uf: this.endereco.estado,
                cep: this.endereco.cep.split("-").join(""),
                numero: this.numero,
                complemento: this.complemento,
                latitude: "",
                longitude: "",
                flagAtivo: true,
                versao: 1
            };

            //putEndereco(objEndereco)

            this.loader = this.loadingController.create({
                content: "Carregando..."
            });
            this.loader.present();
            this.cadCidadaoProvider
                .postEndereco(this.cidadaoId, objEndereco)
                .subscribe(
                    res => {
                        this.loader.dismiss();
                        //console.log("objEndereco", objEndereco);
                        //console.log("retorno do cadCidadaoProvider.postEndereco:", res);

                        let mensagem = "Endereço salvo com sucesso!";

                        this.alert.showSuccess({
                            subTitle: "Sucesso",
                            msg: mensagem,
                            buttons: [{ text: "OK" }]
                        });

                        this.navCtrl.popTo(UsuarioEnderecoPage);
                    },
                    error => this.tratarErroServico(error, "Erro ao tentar salvar o endereço"));
        }
    }

    deletarEndereco() {
        this.loader = this.loadingController.create({
            content: "Carregando..."
        });
        this.loader.present();
        this.cadCidadaoProvider.deleteEndereco(this.enderecoId).subscribe(
            res => {
                this.loader.dismiss();

                this.alert.showSuccess({
                    subTitle: "Sucesso",
                    msg: "Endereço removido com sucesso.",
                    buttons: [{ text: "OK" }]
                });

                //this.navCtrl.push(UsuarioEnderecoPage);
                this.navCtrl.popTo(UsuarioEnderecoPage);
            },
            error => this.tratarErroServico(error, "Erro ao tentar remover o endereço")
        );
    }

    fixMask(mask: any[], text: string) {
        if (!!text && typeof text === 'string') {
            return text.substr(0, mask.length);
        }
        return text;
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
