import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetranConsultaVeiculoResultPage } from './detran-consulta-veiculo-result';

@NgModule({
  declarations: [
    DetranConsultaVeiculoResultPage,
  ],
  imports: [
    IonicPageModule.forChild(DetranConsultaVeiculoResultPage),
  ],
  exports: [
    DetranConsultaVeiculoResultPage
  ]
})
export class DetranConsultaVeiculoResultModule {}
