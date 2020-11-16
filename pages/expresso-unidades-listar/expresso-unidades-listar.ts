import { ExpressoUnidadePage } from './../expresso-unidade/expresso-unidade';
import { CartaServicoProvider } from './../../providers/carta-servico-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExpressoUnidadesListarPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-expresso-unidades-listar',
  templateUrl: 'expresso-unidades-listar.html',
})
export class ExpressoUnidadesListarPage {

  unidades: any[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private cartaServicoProvider: CartaServicoProvider,
  ) {
    this.getUnidadesExpresso();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ExpressoUnidadesListarPage');
  }



  getUnidadesExpresso() {
    this.cartaServicoProvider.getUnidadesExpresso().subscribe
      (
      res => {
        this.unidades = res;
        //console.log('this.unidades',res);
      },
      error => {
        if (error.status < 400 || error.status === 500) {
          //console.log('Erro ao tentar recuperar unidades do expresso.', error);
        } else {
          return [];
        }

      }
      );
    ////console.log('this.itens: ', this.itens);
    //this.loader.dismiss();
  }//function

  openPage(unidadeId) {
    //console.log('Id da Unidade: ', unidadeId);
    this.navCtrl.push(ExpressoUnidadePage,
      {
        "id": unidadeId,
       "unidade": this.unidades.filter(
        (item) => 
        {
          return item.id == unidadeId
        })
      });
  }


}
