import {Component, OnInit} from '@angular/core';
import {TableModule} from "primeng/table";
import {ProvidersService} from "../../services/providers.service";
import {BehaviorSubject, catchError, EMPTY, finalize, Observable, switchMap, take} from "rxjs";
import {ResultSet} from "../../../../shared/models/result-set";
import {IProvider} from "../../models/provider";
import {AsyncPipe, NgIf} from "@angular/common";
import {Button} from "primeng/button";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {Toast} from "primeng/toast";


@Component({
    selector: 'dsv-providers-list',
    imports: [
        TableModule,
        AsyncPipe,
        NgIf,
        Button,
        Toast,
    ],
    templateUrl: './providers-list.component.html',
    styleUrl: './providers-list.component.scss'
})
export class ProvidersListComponent implements OnInit {

    providers$?: Observable<ResultSet<IProvider>>;
    private readonly pagination = new BehaviorSubject<{ offset: number, term: string }>({
        offset: 0,
        term: ''
    });
    pagination$ = this.pagination.asObservable();

    loading: boolean = true;
    rows: number = 3; // Items per page
    first: number = 0;

    constructor(public readonly providersService: ProvidersService,
                private readonly router: Router,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.listerPageChange();
    }

    onRowClick(provider: IProvider): void {
        this.router.navigate(['providers', provider.id])
    }

    deleteProvider(provider: IProvider) {
        this.providersService.deleteProvider(provider.id).pipe(
            take(1),
            catchError(() => {
                this.messageService.add({
                    severity: 'danger',
                    summary: 'Info', detail: 'An error occurred during deletion of provider', life: 3000
                })

                return EMPTY;
            })
        ).subscribe(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Info', detail: 'Provider was deleted successfully', life: 3000
            });

            const pagingInfo = this.pagination.getValue();
            this.pagination.next({...pagingInfo, term: ''});
        });
    }

    addProvider(): void {
        this.router.navigate(['providers', 'create'])
    }

    onPage(event: any) {
        const {first} = event;

        this.loading = true;

        this.pagination.next({offset: first, term: ''});
    }

    private listerPageChange(): void {
        this.providers$ = this.pagination$.pipe(
            switchMap(({offset, term}) => {
                return this.providersService.getProviders(term, offset, this.rows).pipe(
                    finalize(() => this.loading = false)
                );
            })
        )
    }
}
