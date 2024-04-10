import { Component } from '@angular/core';

@Component({
  selector: 'app-contactuser',
  templateUrl: './contactuser.component.html',
  styleUrls: ['./contactuser.component.scss']
})
export class ContactuserComponent {

  role: string = ''; // Variable que almacena el rol del usuario
  user: string = ''; // Variable que almacena el user del usuario
  names: string = ''; // Variable que almacena el names del usuario
  photo: string = ''; // Variable que almacena el foto del usuario

  constructor(){
    const storedRole = localStorage.getItem('role');
    this.role = storedRole !== null ? storedRole : '';

    const storedRole1 = localStorage.getItem('user');
    this.user = storedRole1 !== null ? storedRole1 : '';

    const storedRole2 = localStorage.getItem('names');
    this.names = storedRole2 !== null ? storedRole2 : '';

    const storedRole3 = localStorage.getItem('foto');
    this.photo = storedRole3 !== null ? storedRole3 : '';
  }

}
