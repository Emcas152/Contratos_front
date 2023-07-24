import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  url: string = '';

  httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient: HttpClient) { 
    this.url = environment.apiUrl;
  }

  getParameters(codigo: any): Observable<any> {
    return this.httpClient.get(this.url + `/parameters/${codigo}`, {headers: this.httpHeaders});
  }
}
