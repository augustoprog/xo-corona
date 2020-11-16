import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Covid19AtendeEmCasaPage } from '../covid19-atende-em-casa/covid19-atende-em-casa';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the Covid19AtendeEmCasaInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-covid19-atende-em-casa-info',
  templateUrl: 'covid19-atende-em-casa-info.html',
})
export class Covid19AtendeEmCasaInfoPage {
  public descricao = `O aplicativo Atende em Casa é uma iniciativa da Prefeitura 
    da Cidade do Recife em parceria com o Governo do Estado de Pernambuco para agirmos 
    em conjunto no combate ao Corona Vírus. O App garante aos cidadãos, orientações 
    virtuais sobre a Covid-19. O “Atende em casa - Covid-19” permite uma classificação de risco do paciente e, 
    se necessário, uma vídeo chamada (teleorientação) com enfermeiros ou médicos.`;
  
  public url = 'https://www.atendeemcasa.pe.gov.br';
  private urlPeCidadaoPlayStore = 'https://play.google.com/store/apps/details?id=br.brainy.atende_em_casa';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public _app: App, 
    private socialSharing: SocialSharing) {
  }

  openAtendeEmCasaPage() {
    this._app.getRootNav().push(Covid19AtendeEmCasaPage);
  }

  sharePlayStore() {
    //Common sharing event will open all available application to share
    const opts = {
      message: `PE Cidadão - Atende Em Casa ${this.urlPeCidadaoPlayStore}`,
      subject: 'Atende Em Casa'
    };
    this.socialSharing
      .shareWithOptions(opts)
      .then((entries) => {
        console.log('success ' + JSON.stringify(entries));
      })
      .catch((error) => {
        console.error('error ' + JSON.stringify(error));
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Covid19AtendeEmCasaInfoPage');
  }

}
