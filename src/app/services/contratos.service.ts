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
    data = data || {};
    // If payload nests solicitante under `datos`, lift fecha_traslado to top-level for backend compatibility
    if (!Object.prototype.hasOwnProperty.call(data, 'fecha_traslado')) {
      if (data.datos && Object.prototype.hasOwnProperty.call(data.datos, 'fecha_traslado')) {
        data.fecha_traslado = data.datos.fecha_traslado ?? '';
      } else {
        data.fecha_traslado = '';
      }
    }

    return this.httpClient.post(this.url + '/contratos', data, { headers: this.httpHeaders });
  }

  // Enviar como application/x-www-form-urlencoded (por compatibilidad con backend PHP que usa $_POST)
  postContratosForm(data: any): Observable<any> {
    data = data || {};
    if (!Object.prototype.hasOwnProperty.call(data, 'fecha_traslado')) {
      data.fecha_traslado = '';
    }
    const entries: string[] = [];
    Object.keys(data).forEach(key => {
      const value = data[key];
      const v = (value === null || value === undefined) ? '' : (typeof value === 'object' ? JSON.stringify(value) : String(value));
      entries.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
    });
    const body = entries.join('&');
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.httpClient.post(this.url + '/contratos', body, { headers });
  }

}
