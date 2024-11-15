import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private stationsUrl = `${environment.apiUrl}?limit=100`;
  private observationsUrl = `${environment.apiUrl}/`;

  constructor(private http: HttpClient) { }

  getStationsRecords(): Observable<any> {
    return this.http.get<any>(this.stationsUrl);
  }

  getTemperatureRecords(stationId: string): Observable<any> {
    return this.http.get<any>(`${this.observationsUrl}${stationId}/observations?limit=1`);
  }
}
