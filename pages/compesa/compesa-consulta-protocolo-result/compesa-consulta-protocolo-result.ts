import { CompesaProvider } from './../../../providers/compesa-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the CompesaConsultaProtocoloResultPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-compesa-consulta-protocolo-result',
  templateUrl: 'compesa-consulta-protocolo-result.html',
})
export class CompesaConsultaProtocoloResultPage {

  private protocolo = '';
  public loader;
  resultado;
  retorno;
  nil;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  private compesaProvider: CompesaProvider,
  public loadingController: LoadingController) {

    this.protocolo = navParams.get("protocolo");


    this.loader = this.loadingController.create({
      content: "Carregando..."
    });
    this.loader.present();

    this.compesaProvider.getStatusReportagem(this.protocolo)
      .subscribe(
      res => {

        ////console.log(res);
        this.resultado = res.sucesso;
        this.retorno = res.retorno[0].$;
        this.nil = res.retorno[0].nil;
        this.loader.dismiss();

      },
      error => {
        ////console.log('Erro ao tentar recuperar getStatusReportagem.', error);
        this.loader.dismiss();
      }
      );

  }

  ionViewDidLoad() {
    ////console.log('ionViewDidLoad CompesaConsultaProtocoloResultPage');
  }

}
