import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  url: string = '';

  httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient: HttpClient) { 
    this.url = environment.apiUrl;
  }

  postContratos(data: any): Observable<any> {
    return this.httpClient.post(this.url +'/contratos', data, {headers: this.httpHeaders});
  }

}
