import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Observable, switchMap, take} from "rxjs";
import {ResultSet} from "../../../../shared/models/result-set";
import {IProviderService} from "../../models/provider-service";
import {ProviderServicesService} from "../../services/provider-services.service";
import {TableModule} from "primeng/table";
import {AsyncPipe, CurrencyPipe, DecimalPipe, NgIf} from "@angular/common";
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {ProviderServiceModalComponent} from "../provider-service-modal/provider-service-modal.component";
import {MessageService} from "primeng/api";

@Component({
    selector: 'dsv-provider-services',
    imports: [
        TableModule,
        NgIf,
        AsyncPipe,
        Button,
        Dialog,
        ProviderServiceModalComponent,
        CurrencyPipe,
    ],
    templateUrl: './provider-services.component.html',
    styleUrl: './provider-services.component.scss'
})
export class ProviderServicesComponent implements OnInit {

    @Input() providerId?: number;

    providerServices$?: Observable<ResultSet<IProviderService>>;
    private readonly pagination = new BehaviorSubject<number>(0);
    pagination$ = this.pagination.asObservable();

    rows: number = 3; // Items per page
    first: number = 0;

    showModal = false;

    constructor(private providerServicesService: ProviderServicesService,
                private messageService: MessageService) {
    }

    onPage(event: any) {
        const {first} = event;

        this.pagination.next(first);
    }

    ngOnInit(): void {
        this.providerServices$ = this.pagination$.pipe(
            switchMap((offset) => {
                return this.providerServicesService.getProviderServices(this.providerId!, offset, this.rows)
            })
        )
    }

    addProviderService(): void {
        this.showModal = true;
    }

    handleProviderAdded(providerService: IProviderService): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Info', detail: `Provider service ${providerService.name} was added`, life: 3000
        });

        this.showModal = false;

        this.pagination.next(0);
    }

    deleteProviderService(providerService: IProviderService): void {
        this.providerServicesService.deleteProviderService(this.providerId!, providerService.id).pipe(
            take(1)
        ).subscribe(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Info', detail: `Provider service '${providerService.name}' was successfully deleted`, life: 3000
            });

            this.pagination.next(0);
        });
    }
}
