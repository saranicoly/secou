import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloodService {

  private apiUrl = '/flooding';

  constructor(private http: HttpClient) { }

  sendFlood(streetName: string, level: number): Observable<any> {
    const data = {
      streetName: streetName,
      level: level
    };
    return this.http.post(this.apiUrl, data);
  }
}