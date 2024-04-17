import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '../models/user_model';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private enviroment: string = environment.apiUrl;
  private apiURL: string = this.enviroment + '/api/User/';
  private apiURL1: string = this.enviroment + '/api/Auth/';

  isAdmin = false;
  role: string = ''; // Variable que almacena el rol del usuario
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient) {}

  //Get User
  GetAllUser(): Observable<User[]> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.get<User[]>(`${this.apiURL}GetUser`, {
      headers: httpHeaders1,
    });
  }

  //Get user by Id
  getUserId(id: number): Observable<any> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.get<User[]>(`${this.apiURL}GetUser` + id, {
      headers: httpHeaders1,
    });
  }

  // //Post User
  insertUser(user: User): Observable<any> {
    user.idUser = 0;
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.post(`${this.apiURL}insertUser`, user, {
      headers: httpHeaders1,
    });
  }

  // //Update User
  updatetUser(id: number, user: User): Observable<any> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.put(`${this.apiURL}UpdateUser` + user.idUser, user, {
      headers: httpHeaders1,
      responseType: 'text',
    });
  }

  delete(id: any): Observable<any> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http
      .delete(`${this.apiURL}DeleteUser` + id, { headers: httpHeaders1 })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error occurred:', error);
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  //Login
  login<T>(data: any): Observable<HttpResponse<T>> {
    const httpHeaders: HttpHeaders = this.getHeaders();
    const storedRole = localStorage.getItem('role');
    this.role = storedRole !== null ? storedRole : '';
    console.log('role Local ', this.role);
      if (this.role === "Administrador") {
          this.isAdmin = true;
          this.isAdminSubject.next(true); // Establece el usuario como administrador
        }
    return this.http.post<T>(`${this.apiURL1}login`, data, {
      headers: httpHeaders,
      params: data,
      observe: 'response',
    });
  }

  googleLogin(idToken: string) {
    console.log('si esta funcionando');

    return this.http.post<{ token: string }>(`${this.apiURL1}token`, {
      idToken: idToken,
    });
  }

  facebookLogin(idToken: string) {
    console.log('si esta funcionando F');

    return this.http.post<{ token: string }>(`${this.apiURL1}tokenf`, {
      idToken: idToken,
    });
  }

  getHeaders(): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();
    var token = localStorage.getItem('token');
    if (token) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return httpHeaders;
  }

  logout(): void {
    // Limpiar el localStorage u otros pasos de limpieza necesarios
    this.isAdminSubject.next(false); // Establece el usuario como no administrador
       localStorage.removeItem('token');
  }

  isAdminUser(): boolean {
    return this.isAdmin;
  }

}
