import { Camera, CameraOptions } from "@ionic-native/camera";
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Platform,
  App
} from "ionic-angular";

import { CadCidadaoProvider } from "./../../providers/cad-cidadao/cad-cidadao";

import { UsuarioAlterarSenhaPage } from "./../usuario-alterar-senha/usuario-alterar-senha";
import { UsuarioCadastroPage } from "./../usuario-cadastro/usuario-cadastro";
import { UsuarioContatoPage } from "../usuario-contato/usuario-contato";
import { UsuarioDocumentoPage } from "./../usuario-documento/usuario-documento";
import { UsuarioEnderecoPage } from "./../usuario-endereco/usuario-endereco";
import { UsuarioFacilitadoresPage } from "./../usuario-facilitadores/usuario-facilitadores";
import { UsuarioPreferenciaPage } from "./../usuario-preferencia/usuario-preferencia";
import { UsuarioProgramaSocialPage } from "./../usuario-programa-social/usuario-programa-social";
import { KeycloakService } from "../../keycloak";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  photoUsuario;
  user: any;

  constructor(
    public _app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private cadCidadaoProvider: CadCidadaoProvider,
    public platform: Platform,
    private keycloakService: KeycloakService
  ) { }

  ionViewWillEnter() {
    this.keycloakService.getCidadaoLogado()
      .subscribe(cidadao => {
        this.photoUsuario = 'assets/profile/user.png';

        if (!!cidadao) {
          if (!!cidadao.foto) {
            this.photoUsuario = `data:image/jpeg;base64,${cidadao.foto}`;;
          }
          this.user = cidadao;
          this.user.cpf = this.user.cpf
            .replace(
              /^(\d{3})(\d{3})(\d{3})(\d{2})/,
              "$1.$2.$3-$4"
            );
        }
      });
  }

  chamarCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 113,
      targetHeight: 151
    };

    this.camera.getPicture(options)
      .then(imageData => {

        this.keycloakService.getCidadaoLogado()
          .subscribe(cidadao => {
            const objUpdFoto = {
              id: cidadao.id,
              foto: imageData,
              versao: cidadao.versao
            };
            this.atualizaFotoBd(objUpdFoto);
          });
      },
        err => {
          // Handle error
          alert("erro em camera");
        }
      );
  }

  atualizaFotoBd(objUpdFoto) {
    this.cadCidadaoProvider.setFoto(objUpdFoto)
      .subscribe(cidadao => {
        this.photoUsuario = `data:image/jpeg;base64,${cidadao.foto}`;
      });
  }

  editarDados() {
    this.navCtrl.push(UsuarioCadastroPage);
  }

  editarSenha() {
    this.navCtrl.push(UsuarioAlterarSenhaPage);
  }

  openUsuCadDocumentosPage() {
    this.navCtrl.push(UsuarioDocumentoPage);
  }

  openUsuCadPage() {
    this.navCtrl.push(UsuarioCadastroPage);
  }

  openUsuFacPage() {
    this.navCtrl.push(UsuarioFacilitadoresPage);
  }

  openUsuPrefPage() {
    this.navCtrl.push(UsuarioPreferenciaPage);
  }

  openUsuContatos() {
    this.navCtrl.push(UsuarioContatoPage);
  }

  openUsuProgSociais() {
    this.navCtrl.push(UsuarioProgramaSocialPage);
  }

  openUsuAltSenha() {
    this.navCtrl.push(UsuarioAlterarSenhaPage);
  }

  openUsuEnderecoPage() {
    this.navCtrl.push(UsuarioEnderecoPage);
  }

  sair() {
    this.keycloakService.logout();
    this.navCtrl.setRoot(LoginPage);
  }
}
