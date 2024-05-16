import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '../models/user_model';
import { BehaviorSubject, Observable, catchError, empty, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../models/city_model';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private enviroment: string = environment.apiUrl;
  private apiURL: string = this.enviroment + '/api/City/';


  constructor(private http: HttpClient) {}

  //Get User
  GetAllCity(): Observable<City[]> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.get<City[]>(`${this.apiURL}GetCity`, {
      headers: httpHeaders1,
    });
  }

  //Get user by Id
  getCityId(id: number): Observable<any> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.get<City[]>(`${this.apiURL}GetCityI` + id, {
      headers: httpHeaders1,
    });
  }

    //Get user by Nombre
    getCityNombre(nombre: string): Observable<any> {
      const httpHeaders1: HttpHeaders = this.getHeaders();
      return this.http.get<City[]>(`${this.apiURL}GetCityN` + nombre, {
        headers: httpHeaders1,
      });
    }

  // //Post User
  insertCity(city: City): Observable<any> {
    city.id = 0;
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.post(`${this.apiURL}insertCity`, city, {
      headers: httpHeaders1,
    });
  }

  // //Update User
  updatetCity(id: number, city: City): Observable<any> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.put(`${this.apiURL}UpdateCity` + city.id, city, {
      headers: httpHeaders1,
      responseType: 'text',
    });
  }

  delete(id: any): Observable<any> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http
      .delete(`${this.apiURL}DeleteCity` + id, { headers: httpHeaders1 })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError('Something bad happened; please try again later.');
        })
      );
  }



  getHeaders(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    var token = localStorage.getItem('token');
    if (token) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return httpHeaders;
  }
}
