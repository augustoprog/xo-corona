import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CtmLinhaItinerarioPage } from './ctm-linha-itinerario';
import { ServicoMapaPageModule } from '../carta-servico/servico-mapa/servico-mapa.module';

@NgModule({
    declarations: [
        CtmLinhaItinerarioPage,
    ],
    imports: [
        ServicoMapaPageModule,
        IonicPageModule.forChild(CtmLinhaItinerarioPage),
    ],
    exports: [
        CtmLinhaItinerarioPage
    ]
})
export class CtmLinhaItinerarioPageModule { }
