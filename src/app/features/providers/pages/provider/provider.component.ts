import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {InputText} from "primeng/inputtext";
import {InputTextarea} from "primeng/inputtextarea";
import {ButtonDirective} from "primeng/button";
import {ActivatedRoute} from "@angular/router";
import {IProvider} from "../../models/provider";
import {ProvidersService} from "../../services/providers.service";
import {take} from "rxjs";
import {Toast} from "primeng/toast";
import {MessageService} from "primeng/api";
import {ProviderServicesComponent} from "../../components/provider-services/provider-services.component";

@Component({
    selector: 'app-provider',
    imports: [
        ReactiveFormsModule,
        NgIf,
        InputText,
        InputTextarea,
        ButtonDirective,
        Toast,
        ProviderServicesComponent
    ],
    templateUrl: './provider.component.html',
    styleUrl: './provider.component.scss'
})
export class ProviderComponent implements OnInit {
    providerForm?: FormGroup;
    providerId?: number;

    constructor(private fb: FormBuilder,
                private providerService: ProvidersService,
                private route: ActivatedRoute,
                private messageService: MessageService) {
    }

    ngOnInit() {
        this.providerId = +this.route.snapshot.params['id'];

        if (this.providerId) {
            this.loadProvider(this.providerId);
        } else {
            this.buildForm();
        }
    }

    onSubmit() {
        const isEdit = !!this.providerForm?.get('id')?.value;

        if (isEdit) {
            this.editProvider();
        } else {
            this.createProvider();
        }
    }

    private createProvider(): void {
        const provider = this.providerForm?.getRawValue();

        this.providerService.createProvider({
            firstName: provider.firstName,
            lastName: provider.lastName,
            email: provider.email,
            description: provider.description,
        }).pipe(take(1)).subscribe((provider) => {
            this.providerForm?.get('id')?.patchValue(provider.id);
            this.messageService.add({
                severity: 'success',
                summary: 'Info', detail: 'Provider was created successfully', life: 3000
            })
        });
    }

    private editProvider(): void {
        const provider = this.providerForm?.getRawValue();

        this.providerService.editProvider(provider.id, {
            id: provider.id,
            firstName: provider.firstName,
            lastName: provider.lastName,
            email: provider.email,
            description: provider.description,
        }).pipe(take(1)).subscribe(() => {
            this.messageService.add({
                severity: 'success',
                summary: 'Info', detail: 'Provider was updated successfully', life: 3000
            })
        });
    }

    private loadProvider(id: number): void {
        this.providerService.getProvider(id).pipe(
            take(1)
        ).subscribe((provider) => {
            this.buildForm(provider);
        })
    }

    private buildForm(provider?: IProvider): void {
        this.providerForm = this.fb.group({
            id: [provider?.id ?? '',],
            firstName: [provider?.firstName ?? '', Validators.required],
            lastName: [provider?.lastName ?? '', Validators.required],
            email: [provider?.email ?? '', [Validators.required, Validators.email]],
            description: [provider?.description ?? ''],
        });
    }
}
