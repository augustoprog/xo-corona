import { CadCidadaoProvider } from './../../providers/cad-cidadao/cad-cidadao';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { KeycloakService } from '../../keycloak';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { getErrorMessage } from '../../util/common';
import { AlertProvider } from '../../providers/alert/alert';

/**
 * Generated class for the UsuarioProgramaSocialPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-usuario-programa-social',
  templateUrl: 'usuario-programa-social.html',
})
export class UsuarioProgramaSocialPage {

  cidadaoLogado: any;
  programasSociais: any;

  meusProgramasSociais = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cadCidadaoProvider: CadCidadaoProvider,
    private keycloakService: KeycloakService,
    private alert: AlertProvider
  ) {

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad UsuarioProgramaSocialPage');
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => {
        this.cidadaoLogado = cidadao;
        this.getMeusProgramasSociais();
      });
  }


  getListaProgramasSociais() {

    ////console.log('getListaProgramasSociais' + Date.now);

    this.cadCidadaoProvider.getProgramasSociais().subscribe(
      res => {

        this.programasSociais = res;

        //console.log('geProgramasSociais:', this.programasSociais);

      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar os programas sociais")
    );
  }

  getMeusProgramasSociais() {

    this.cadCidadaoProvider.getMeusProgramasSociais(this.cidadaoLogado.id).subscribe(
      res => {

        //this.meusProgramasSociais = res;

        this.meusProgramasSociais = [];

        for (let item of res) {


          if (this.meusProgramasSociais.indexOf(item.programaSocial.id) == -1) {
            this.meusProgramasSociais.push(item.programaSocial.id);
          }

        }
        //console.log('meusProgramasSociais: ',this.meusProgramasSociais);

        this.getListaProgramasSociais();

      },
      error => this.tratarErroServico(error, "Erro ao tentar recuperar os programas sociais do cidadão")
    );

  }


  checkProgramaSocial(programaSocialId) {

    if (this.meusProgramasSociais.indexOf(programaSocialId) == -1) {
      return false;
    } else {
      return true;
    }

  }

  toogle(programaSocialId, ev) {

    //alert(ev.checked + '\n' + programaSocialId);

    // Se ativo
    if (ev.checked) {

      if (this.meusProgramasSociais.indexOf(programaSocialId) == -1) {

        // chamar o post para inserir programa social para cidadao logado

        let objProgramaSocial = {

          "programaSocial": {
            "id": programaSocialId
          },
          "versao": 1,
          "usuarioLogado": null,
          "orgaoLdapUsuarioLogado": null

        };

        this.cadCidadaoProvider.postProgramaSocialCidadao(this.cidadaoLogado.id, objProgramaSocial).subscribe(
          res => {


            //console.log('postProgramaSocialCidadao:', res);

            //console.log('meusProgramasSociais: ',this.meusProgramasSociais);

          },
          error => this.tratarErroServico(error, "Erro ao tentar salvar os programas sociais do cidadão")
        );


      }

      // Se Inativo  
    } else {


      if (this.meusProgramasSociais.indexOf(programaSocialId) != -1) {

        this.cadCidadaoProvider.getMeusProgramasSociais(this.cidadaoLogado.id).subscribe(
          res => {

            for (let item of res) {


              // verifica se o programa social interado é igual ao que deseja apagar
              if (item.programaSocial.id == programaSocialId) {
                let programaSocialCidadaoId = item.id;

                // excluir programa
                this.cadCidadaoProvider.deleteProgramaSocialCidadao(programaSocialCidadaoId).subscribe(
                  res => {
                    //console.log('deleteProgramaSocialCidadao ('+programaSocialId+') excluido com sucesso!', res);
                    //this.getMeusProgramasSociais();
                    let idx = this.meusProgramasSociais.indexOf(programaSocialId);
                    this.meusProgramasSociais.splice(idx,1);

                  },
                  error => this.tratarErroServico(error, "Erro ao tentar remover o programa social do cidadão")
                );

              } // fim de: verifica se o programa social interado é igual ao que deseja apagar

            }

            this.getListaProgramasSociais();

          },
          error => this.tratarErroServico(error, "Erro ao tentar recuperar os programas sociais do cidadão")
        );


      }

    } // fim se ativo

  } // fim toogle

  private tratarErroServico(e: any, title?: string) {
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
