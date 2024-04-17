import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './services/users.service';
import { Subscription } from 'rxjs';
import { LoginComponent } from './components/users/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent  implements OnInit  {

role: boolean = false; // Variable que almacena el rol del usuario

 constructor(private authService: UsersService ) {
  }

ngOnInit(): void {
  this.role = this.authService.isAdminUser();
  console.log("role app ", this.role);
  this.authService.isAdmin$.subscribe(isAdmin => {
    this.role = isAdmin; // Actualiza el estado del usuario en AppComponent
    console.log("role app ", this.role);
  });
}

}


