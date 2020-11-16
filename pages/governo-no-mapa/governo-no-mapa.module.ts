import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GovernoNoMapaPage } from './governo-no-mapa';
import { ServicoMapaPageModule } from '../carta-servico/servico-mapa/servico-mapa.module';

@NgModule({
    declarations: [
        GovernoNoMapaPage,
    ],
    imports: [
        ServicoMapaPageModule,
        IonicPageModule.forChild(GovernoNoMapaPage),
    ],
    exports: [
        GovernoNoMapaPage
    ]
})
export class GovernoNoMapaPageModule { }
