import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProvidersRoutingModule} from './providers-routing.module';
import {ProvidersService} from "./services/providers.service";
import {HttpClientModule} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {ProviderServicesService} from "./services/provider-services.service";
import {ServicesService} from "./services/services.service";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ProvidersRoutingModule,
        HttpClientModule
    ],
    providers: [
        ProvidersService,
        MessageService,
        ProviderServicesService,
        ServicesService
    ]
})
export class ProvidersModule {
}
