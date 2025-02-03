import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {InputText} from "primeng/inputtext";
import {AsyncPipe, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {catchError, EMPTY, Observable, take} from "rxjs";
import {ServicesService} from "../../services/services.service";
import {ProviderServicesService} from "../../services/provider-services.service";
import {IProviderService} from "../../models/provider-service";
import {MessageService} from "primeng/api";

@Component({
    selector: 'dsv-provider-service-modal',
    imports: [
        ButtonDirective,
        InputText,
        NgIf,
        ReactiveFormsModule,
        DropdownModule,
        AsyncPipe
    ],
    templateUrl: './provider-service-modal.component.html',
    styleUrl: './provider-service-modal.component.scss'
})
export class ProviderServiceModalComponent implements OnInit {

    @Input() providerId?: number;
    @Output() providerAdded = new EventEmitter<IProviderService>();

    providerServiceForm?: FormGroup;

    services$?: Observable<any>;

    constructor(private fb: FormBuilder,
                private servicesService: ServicesService,
                private providerServicesService: ProviderServicesService,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.buildForm();

        this.services$ = this.servicesService.getServices();
    }

    onSubmit(): void {
        const providerService = this.providerServiceForm?.getRawValue();

        this.providerServicesService.createProviderService(this.providerId!, {
            serviceId: providerService.serviceId,
            pricePerHour: providerService.pricePerHour,
            durationMinutes: providerService.durationMinutes
        }).pipe(
            take(1),
            catchError((response) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Info', detail: response.error.detail, life: 3000
                });

                return EMPTY;
            })
        ).subscribe((ps) => {
            this.providerAdded.next(ps);
        });
    }

    private buildForm(): void {
        this.providerServiceForm = this.fb.group({
            serviceId: [null, Validators.required],
            durationMinutes: [null, Validators.required],
            pricePerHour: [null, [Validators.required]],
        });
    }

}
