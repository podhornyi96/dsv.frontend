import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Observable, switchMap} from "rxjs";
import {ResultSet} from "../../../../shared/models/result-set";
import {IProviderService} from "../../models/provider-service";
import {ProviderServicesService} from "../../services/provider-services.service";
import {TableModule} from "primeng/table";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
    selector: 'dsv-provider-services',
    imports: [
        TableModule,
        NgIf,
        AsyncPipe,
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

    constructor(private providerServicesService: ProviderServicesService) {
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
}
