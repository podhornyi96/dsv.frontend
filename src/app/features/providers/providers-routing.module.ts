import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProvidersListComponent} from "./pages/providers-list/providers-list.component";
import {ProviderComponent} from "./pages/provider/provider.component";

const routes: Routes = [
    {
        component: ProvidersListComponent,
        path: ''
    },
    {component: ProviderComponent, path: ':id'},
    {component: ProviderComponent, path: 'create'},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProvidersRoutingModule {
}
