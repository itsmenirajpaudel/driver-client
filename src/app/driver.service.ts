import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


interface IDriver {
  id: number, 
  name: string,
  latlng: Array<number>
};

interface IResponse {
  success: boolean, 
  payload?: Array<IDriver>,
  message?: string
};

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  constructor(private http:HttpClient) {}

  getDrivers(): Observable<IResponse> {
    const {baseUrl, version} = environment; 
    return this.http.get<IResponse>(`${baseUrl}/${version}/drivers`)
  }

  startMotions(): Observable<IResponse> {
    const {baseUrl, version} = environment; 
    return this.http.post<IResponse>(`${baseUrl}/${version}/start-motions`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
