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

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private enviroment: string = environment.apiUrl;
  private apiURL: string = this.enviroment + '/api/User/';
  private apiURL1: string = this.enviroment + '/api/Auth/';

//agregue esto
  role: string = ''; // Variable que almacena el rol del usuario
  isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isUserSubject: BehaviorSubject<any> =new BehaviorSubject<any>('');
  isAdmin$ = this.isAdminSubject.asObservable();


  constructor(private http: HttpClient) {
    const storedRole = localStorage.getItem('role');
        this.role = storedRole !== null ? storedRole : '';
  }

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
   const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.post(`${this.apiURL}insertUser`, user, {
      headers: httpHeaders1,
    });
  }

  // //Update User
  updatetUser(id: number, user: User): Observable<any> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    console.log("user.idUser ",user.idUser);
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
    return this.http.post<T>(`${this.apiURL1}login`, data, {
      headers: httpHeaders,
      params: data,
      observe: 'response',
    }).pipe(
      tap(
        (response: HttpResponse<any>) => {
          const body = response.body!.response;
          console.log("si ffuvfd ",body);
          this.isUserSubject.next(body);
          this.isAdminSubject.next(true);
        }
      ),
    );
  }

  googleLogin(idToken: string) {
    console.log('si esta funcionando ');
    return this.http.post<{ token: string }>(`${this.apiURL1}token`, {
      idToken: idToken,
    }).pipe(
      tap(
        (token: any) => {
          console.log("tokenG ",token.token);
          this.isUserSubject.next(token.token);
          this.isAdminSubject.next(true);
        }
      ),
    );
  }

  facebookLogin(idToken: string) {
    console.log('si esta funcionando F');
    return this.http.post<{ token: string }>(`${this.apiURL1}tokenf`, {
      idToken: idToken,
    }).pipe(
      tap(
        (userData: any) => {
          console.log("userdataF ",userData.token);
          this.isUserSubject.next(userData.token);
          this.isAdminSubject.next(true);
        }
      ),
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

  logout(): void {
    // Limpiar el localStorage u otros pasos de limpieza necesarios
    this.isAdminSubject.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }

  get userLoginOn(): Observable<boolean>{
    return this.isAdminSubject.asObservable();
  }
}
