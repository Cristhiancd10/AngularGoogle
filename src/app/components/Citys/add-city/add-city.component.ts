import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { formatDate } from '@angular/common';
import { City } from 'src/app/models/city_model';
import { CityService } from 'src/app/services/city.service';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.css'],
})
export class AddCityComponent implements OnInit {
  myForm!: FormGroup;
  public id!: any;
  editMode: boolean = false;
  ignoreExistPendingChanges: boolean = false;

  newuser: City = {
    id: 0,
    nombre: '',
    codigoPostal: '',
  };

  format = 'MM/dd/yyyy HH:mm:ss';
  locale = 'en-US';
  formattedDate = formatDate(new Date(), this.format, this.locale);

  constructor(
    private cityService: CityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  existenCambiosPendientes(): boolean {
    if (this.ignoreExistPendingChanges) {
      return false;
    }
    return !this.myForm.pristine;
  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      codigoPostal: new FormControl('', Validators.required),
    });

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id == undefined) {
      return;
    }
    this.editMode = true;
    this.cityService.getCityId(this.id).subscribe((data) => {
      console.log(data);
      this.newuser = data;
    });
  }

  addCity() {
    this.ignoreExistPendingChanges = true;
    if (this.editMode) {
      var updatecity = {
        id: this.newuser.id,
        nombre: this.newuser.nombre,
        codigoPostal: this.newuser.codigoPostal,
      };

      this.cityService.updatetCity(this.id, updatecity).subscribe({
        next: (user) => {
          console.log(user);
          this.router.navigate(['ListC']);
        },
        error: (response) => {
          console.log(response);
        },
      });
    } else {
      console.log(this.newuser);
      this.cityService.insertCity(this.newuser).subscribe({
        next: (city) => {
          console.log(city);
          this.router.navigate(['ListC']);
        },
        error: (response) => {
          console.log(response);
        },
      });
    }
  }
}
