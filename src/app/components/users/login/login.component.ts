import {
  Component,
  OnDestroy,
 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Facebook, Google, Login } from 'src/app/models/login_model';
import { Response } from 'src/app/models/reponse_model';
import { Subscription, from } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { ErrorStateMatcher1 } from 'src/app/error-state-matcher1';
import {
  FacebookLoginProvider,
  SocialAuthService,
 } from '@abacritt/angularx-social-login';

import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  formLogin: FormGroup;
  subRef$?: Subscription;
  subRef$1?: Subscription;
  matcher = new ErrorStateMatcher1();
  scrHeight: any;
  scrWidth: any;
  authSubscription!: Subscription;
  loggedIn = false;
  name!: string;
  idtoken!: string;
  toGoo: any;
  user: any;

  tokenDataArray: any[] = []; // Arreglo para almacenar los datos decodificados en forma de array
  decodedToken: any; // Declara una variable para almacenar los datos decodificados



  getScreenSize() {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    console.log(this.scrHeight, this.scrWidth);
  }

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private dataService: UsersService,
    private authService: SocialAuthService // private securityService: SecurityService
  ) {
    this.getScreenSize();

    this.formLogin = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  Login() {
    const userLogin: Login = {
      username: this.formLogin.value.username,
      password: this.formLogin.value.password,
    };

    console.log(userLogin);
    this.subRef$ = this.dataService.login<Response>(userLogin).subscribe({
      next: (res) => {
        const token = res.body!.response;
        console.log('token', res.body?.response);
        sessionStorage.setItem('token', token);
        localStorage.setItem('token', token);
        this.decodedToken = jwt_decode(token);
        this.tokenDataArray = Object.entries(this.decodedToken).map(
          ([key, value]) => value
        );
        const user = this.tokenDataArray[0];
        const role = this.tokenDataArray[1];
        localStorage.setItem('role', role);
        localStorage.setItem('user', user);
        console.log('role ', this.tokenDataArray);
        this.router.navigate(['/List']);

      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  hasError(nombreControl: string, validacion: string) {
    const control = this.formLogin.get(nombreControl);
    return control?.hasError(validacion);
  }

  ngOnDestroy() {
    console.log('this.subRef$ ' + this.subRef$);
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    } else {
      this.authSubscription.unsubscribe();
    }
  }

  loginGoogle() {
    this.subRef$ = this.authService.authState.subscribe({
      next: (user) => {
        if (user) {
          const Google: Google = {
            username: user.idToken,
          };
          const names=user.name;
          const foto= user.photoUrl;
          console.log("user"+user.name);
          // Obtener nombre de usuario y token de ID
          this.name = user.name;
          this.dataService.googleLogin(Google.username).subscribe((res) => {
            console.log('Se inició sesión correctamente con Google.');
            console.log(
              'restoken ' + res.token + ' googleee ' + Google.username
            );
            if (res.token) {
              localStorage.setItem('token', res.token);
              this.decodedToken = jwt_decode(res.token);
              this.tokenDataArray = Object.entries(this.decodedToken).map(
                ([key, value]) => value
              );

              const user = this.tokenDataArray[0];
              const role = this.tokenDataArray[1];
              localStorage.setItem('names', names);
              localStorage.setItem('foto', foto);
              localStorage.setItem('role', role);
              localStorage.setItem('user', user);
              console.log(this.tokenDataArray, ' role ', role);
              // Redirigir al usuario a la página de lista después del inicio de sesión
              this.router.navigateByUrl('List');
            }
          });
          console.log('GoogleIdToken: ', this.idtoken);
        } else {
          console.log('El usuario no está autenticado.');
        }
      },
      error: (err) => {
        console.error('Error en la autenticación:', err);
      },
    });
  }
  googleSignin(googleWrapper: any) {
    googleWrapper.click();
    this.loginGoogle();
  }

  // Method to sign in with facebook.
  FacebookSignin(platform: string): void {
    platform = FacebookLoginProvider.PROVIDER_ID;
    this.subRef$ = from(this.authService.signIn(platform)).subscribe(
      (response) => {

        if (response) {
          const Facebook: Facebook = {
            username: response.authToken,
          };
          const names=response.name;
          const foto= response.photoUrl;
          this.name = response.name;
          console.log(' facebook10 ' + response.name);
          this.dataService.facebookLogin(Facebook.username).subscribe((res) => {
            if (res) {
              console.log('Se inició sesión correctamente con facebook.');
              localStorage.setItem('token', res.token);
              this.decodedToken = jwt_decode(res.token);
              this.tokenDataArray = Object.entries(this.decodedToken).map(
                ([key, value]) => value
              );
              const user = this.tokenDataArray[0];
              const role = this.tokenDataArray[1];
              localStorage.setItem('names', names);
              localStorage.setItem('foto', foto);
              localStorage.setItem('role', role);
              localStorage.setItem('user', user);
              console.log(this.tokenDataArray, ' role ', role);
              this.router.navigateByUrl('List');
            }
          });
        }
      },
      (error) => {
        console.error('Error al iniciar sesión con Facebook:', error);

      }
    );
  }

  // Method to log out.
  signOut(): void {
    this.authService.signOut();
    this.user = null;
    console.log('User signed out.');
  }



}

