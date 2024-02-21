import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login_model';
import { Response } from 'src/app/models/reponse_model';
import { Subscription } from 'rxjs';
import { SecurityService } from 'src/app/services/security.service';
import { UsersService } from 'src/app/services/users.service';
import { ErrorStateMatcher1 } from 'src/app/error-state-matcher1';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  subRef$?: Subscription;
  matcher = new ErrorStateMatcher1();
  scrHeight: any;
  scrWidth: any;
  authSubscription!: Subscription;
  user1:SocialUser | null=null;
  loggedIn = false;

  // HostListener: https://angular.io/api/core/HostListener
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
    console.log(this.scrHeight, this.scrWidth);
  }

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private authService: SocialAuthService,
    private dataService: UsersService,
    private securityService: SecurityService
  ) {
    this.getScreenSize();
    this.securityService.LogOff();

    this.formLogin = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authSubscription = this.authService.authState.subscribe((user) => {
      localStorage.setItem('token',user.idToken)
      console.log('user10', user.idToken);
      console.log("token "+localStorage.getItem('token'));
      if (user.idToken == null) {
        console.log("no esta logueado");
      }else{

        this.router.navigate(['']);
      }

    });

  }

Login() {
    const userLogin: Login = {
      username: this.formLogin.value.username,
      password: this.formLogin.value.password,
    };

    console.log(userLogin);
    this.subRef$ = this.dataService.login<Response>(userLogin)
      .subscribe({
        next: (res) => {
          const token = res.body!.response;
          console.log('token', token);
          //this.securityService.SetAuthData(token);
          sessionStorage.setItem('token', token);
           this.router.navigate(['']);
        },
        error:(response) =>{
          console.log(response);
        },
});
  }

  hasError(nombreControl: string, validacion: string) {
    const control = this.formLogin.get(nombreControl);
    return control?.hasError(validacion);
  }

  ngOnDestroy() {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
    this.authSubscription.unsubscribe();
  }

  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }

}
