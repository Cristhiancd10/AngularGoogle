import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { User } from 'src/app/models/user_model';
import { UsersService } from 'src/app/services/users.service';
import { formatDate } from '@angular/common';
import { Subscription } from 'rxjs';
import { CityService } from 'src/app/services/city.service';
import { MatTableDataSource } from '@angular/material/table';
import { City } from 'src/app/models/city_model';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
//agregue esto
  subRef$?: Subscription;
  dataSource = new MatTableDataSource<City>();
  myForm!: FormGroup;
  public idUser!: any;
  editMode: boolean = false;
  ignoreExistPendingChanges: boolean = false;
  ciC: string = '';
  CityGuardar:City = new City();
  CityGuardarU:City = new City();
  //UserEdit!:User ;

   newuser: User = {
    idUser: 0,
    id_Card: '',
    username: '',
    password: '',
    role: '',
    names: '',
    phone: '',
    email: '',
    city:new City(),
    registration_date: '',
  };

  format = 'MM/dd/yyyy HH:mm:ss';
  locale = 'en-US';
  formattedDate = formatDate(new Date(), this.format, this.locale);

  //combobox
  ciudades: string[] = [];

  constructor(
    private cityService:CityService,
    private userService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) {}

  existenCambiosPendientes(): boolean {
    if (this.ignoreExistPendingChanges) {
      return false;
    }
    return !this.myForm.pristine;
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      id_Card: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      names: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      registration_date: new FormControl('', Validators.required),
    });
     ///agregue esto
     this.cityService.GetAllCity().subscribe({
      next: (city) => {
        this.ciudades = city.map(cities=> cities.nombre);
        console.log("ciudades ",this.ciudades);
      },
      error: (error) => {
        console.error('Error obteniendo ciudades', error);
      }
    });

    ///////
    this.newuser.registration_date = this.formattedDate;


    this.idUser = this.activatedRoute.snapshot.paramMap.get('idUser');

    if (this.idUser == undefined) {

      return;
    }
    this.editMode = true;

    this.userService.getUserId(this.idUser).subscribe((data) => {
      console.log(data);
      this.ciC=data.city.nombre;
      console.log(" this.newuser.idUser ",data.idUser," ciudad ", this.ciC);

      this.cityService.getCityNombre(this.ciC).subscribe((data:City) => {
        this.CityGuardarU=data;
        this.newuser.city=this.CityGuardarU;
        console.log("Ciudad Ac ", this.newuser.city," ciudad ciC ",this.ciC, " nombre ", this.newuser.city.nombre);
      });

      if (this.editMode) {
        this.newuser.idUser=data.idUser;
        this.myForm.patchValue({
          id_Card: data.id_Card,
          username: data.username,
          password:data.password,
          role:data.role,
          names: data.names,
          phone: data.phone,
          email: data.email,
          city: data.city.nombre,
          registration_date: data.registration_date,
        });
      }


    });

  }

  addUser() {


    this.ignoreExistPendingChanges = true;

    if (this.editMode) {
      this.newuser.id_Card = this.myForm.value.id_Card;
      this.newuser.username = this.myForm.value.username;
      this.newuser.password = this.myForm.value.password;
      this.newuser.role = this.myForm.value.role;
      this.newuser.names = this.myForm.value.names;
      this.newuser.phone = this.myForm.value.phone;
      this.newuser.email = this.myForm.value.email;

    console.log("Ciudad Ac1 ",  this.newuser.city);
      var updateuser = {
        idUser: this.newuser.idUser,
        id_Card: this.newuser.id_Card,
        username: this.newuser.username,
        password: this.newuser.password,
        role: this.newuser.role,
        names: this.newuser.names,
        phone: this.newuser.phone,
        email: this.newuser.email,
        city:  this.newuser.city,
        registration_date: this.newuser.registration_date,
      };

      this.userService.updatetUser(this.idUser, updateuser).subscribe({
        next: (user) => {
          console.log(user);
          this.router.navigate(['List']);
        },
        error: (response) => {
          console.log(response);
        },
      });
    } else {
      this.newuser.id_Card = this.myForm.value.id_Card;
      this.newuser.username = this.myForm.value.username;
      this.newuser.password = this.myForm.value.password;
      this.newuser.role = this.myForm.value.role;
      this.newuser.names = this.myForm.value.names;
      this.newuser.phone = this.myForm.value.phone;
      this.newuser.email = this.myForm.value.email;
      this.newuser.registration_date = this.myForm.value.registration_date;
      console.log("ciudad ", this.newuser.city);
      this.userService.insertUser(this.newuser).subscribe({
        next: (user) => {
          console.log(user);
          this.router.navigate(['List']);
        },
        error: (response) => {
          console.log(response);
        },
      });
    }
  }

}

