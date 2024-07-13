import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000'; // URL do seu backend FastAPI

  constructor(private http: HttpClient) {}

  getProcessedData(inputText: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/endpoint`, { text: inputText });
  }
}