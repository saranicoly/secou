import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  private apiUrl = 'http://127.0.0.1:8000/api/google-maps-api-key'; // URL do seu backend

  constructor(private http: HttpClient) {}

  getApiKey(): Observable<{ apiKey: string }> {
    return this.http.get<{ apiKey: string }>(this.apiUrl);
  }

  getAddress(lat: number, lng: number, apiKey: string) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    return this.http.get<any>(url);
  }
}