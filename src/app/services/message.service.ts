import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private enviroment: string = environment.apiUrl;
  private apiURL: string = this.enviroment + '/api/Message/';

  constructor(private http: HttpClient) {}

  getMessages(userId: string): Observable<Message[]> {
    //const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.get<Message[]>(`${this.apiURL}GetMessage`+userId);
  }
  sendMessage(message: Message): Observable<Message> {
    const httpHeaders1: HttpHeaders = this.getHeaders();
    return this.http.post<Message>(`${this.apiURL}insertMessage`, message, {
      headers: httpHeaders1,
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
}
