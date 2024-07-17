import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/get_route';

  constructor(private http: HttpClient) {}

  getRoute(saidaInput: string, destinoInput: string, horaInput: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      saida: saidaInput,
      destino: destinoInput,
      hora: horaInput
    });
  }
}