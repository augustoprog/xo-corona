import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CtmMapaParadasPage } from './ctm-mapa-paradas';
import { ServicoMapaPageModule } from '../carta-servico/servico-mapa/servico-mapa.module';

@NgModule({
    declarations: [
        CtmMapaParadasPage,
    ],
    imports: [
        ServicoMapaPageModule,
        IonicPageModule.forChild(CtmMapaParadasPage),
    ],
    exports: [
        CtmMapaParadasPage
    ]
})
export class CtmMapaParadasPageModule { }
