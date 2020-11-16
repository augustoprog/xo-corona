import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { DetranConsultaCnhPage } from "./../detran/detran-consulta-cnh/detran-consulta-cnh";
import { DetranConsultaVeiculoPage } from "./../detran/detran-consulta-veiculo/detran-consulta-veiculo";

/**
 * Generated class for the MenuServicoDetran page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: "page-menu-servico-detran",
  templateUrl: "menu-servico-detran.html"
})
export class MenuServicoDetranPage {
  search: string;

  items: { name: string; page: any }[] = [
    { name: "Consulta de Pontos na CNH", page: DetranConsultaCnhPage },
    { name: "Consulta Veículos", page: DetranConsultaVeiculoPage }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
