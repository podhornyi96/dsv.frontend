import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ResultSet} from "../../../shared/models/result-set";
import {IProvider} from "../models/provider";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {ICreateProvider} from "../models/create-provider";

@Injectable()
export class ProvidersService {

  constructor(private readonly httpClient: HttpClient) { }

  getProviders(firstName: string, skip: number = 0, top: number = 10): Observable<ResultSet<IProvider>> {
    return this.httpClient.get<ResultSet<IProvider>>(`${environment.apiUrl}/providers?skip=${skip}&take=${top}&firstName=${firstName ?? ''}`);
  }

  getProvider(id: number): Observable<IProvider> {
    return this.httpClient.get<IProvider>(`${environment.apiUrl}/providers/${id}`);
  }

  createProvider(model: ICreateProvider): Observable<IProvider> {
    return this.httpClient.post<IProvider>(`${environment.apiUrl}/providers`, model);
  }

  editProvider(id: number, model: IProvider): Observable<IProvider> {
    return this.httpClient.put<IProvider>(`${environment.apiUrl}/providers/${id}`, model);
  }

  deleteProvider(id: number): Observable<IProvider> {
    return this.httpClient.delete<IProvider>(`${environment.apiUrl}/providers/${id}`);
  }

}
