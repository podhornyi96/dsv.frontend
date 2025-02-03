import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IService} from "../models/service";
import {environment} from "../../../../environments/environment";

@Injectable()
export class ServicesService {

  constructor(private readonly httpClient: HttpClient) { }

  getServices(): Observable<IService[]> {
    return this.httpClient.get<IService[]>(`${environment.apiUrl}/services`);
  }

}
