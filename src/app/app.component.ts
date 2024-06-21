import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { User } from './models/user_model';
import { jwtDecode } from 'jwt-decode';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent  implements OnInit, OnDestroy  {

userLoginOn?:boolean;
userData!:string;

role!:string;
tokenDataArray: any[] = []; // Arreglo para almacenar los datos decodificados en forma de array
decodedToken: any; // Declara una variable para almacenar los datos decodificados

  constructor(private authService: UsersService, private authServiceS: SocialAuthService, private router: Router,  ) {
   }


 ngOnInit(): void {
  this.authService.isAdminSubject.subscribe({
    next:(userLoginOn) => {
      this.userLoginOn=userLoginOn;
      console.log("logOn ",this.userLoginOn );
      if (this.userLoginOn) {
        console.log("funciona ");
        this.authService.isUserSubject.subscribe({
          next:(userData)=>{
            this.userData=userData;
            this.decodedToken = jwtDecode(this.userData);
            this.tokenDataArray = Object.entries(this.decodedToken).map(
              ([key, value]) => value
            );
            console.log("log User ", this.tokenDataArray," ",  this.tokenDataArray[1]);
            this.role=this.tokenDataArray[1];
          }

        });
      }
    }
  });
}

ngOnDestroy(): void {
  this.authService.isUserSubject.unsubscribe();
  this.authService.isAdminSubject.unsubscribe();
}

logout() {
  this.authServiceS.signOut();
  this.router.navigate(['']);
    // this.user = null;
  this.userLoginOn = false; // Actualizas el estado a no logueado
}

}
