import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ResultSet} from "../../../shared/models/result-set";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {IProviderService} from "../models/provider-service";
import {ICreateProviderService} from "../models/create-provider-service";
import {IProvider} from "../models/provider";

@Injectable()
export class ProviderServicesService {

    constructor(private readonly httpClient: HttpClient) {
    }

    getProviderServices(providerId: number, skip: number = 0, top: number = 10): Observable<ResultSet<IProviderService>> {
        return this.httpClient.get<ResultSet<IProviderService>>(`${environment.apiUrl}/providers/${providerId}/services?skip=${skip}&take=${top}`);
    }

    createProviderService(providerId: number, model: ICreateProviderService): Observable<IProviderService> {
        return this.httpClient.post<IProviderService>(`${environment.apiUrl}/providers/${providerId}/services`, model);
    }

    deleteProviderService(providerId: number, id: number): Observable<void> {
        return this.httpClient.delete<void>(`${environment.apiUrl}/providers/${providerId}/services/${id}`);
    }
}
