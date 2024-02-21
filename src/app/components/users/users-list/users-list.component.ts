import { User } from 'src/app/models/user_model';
import { UsersService } from 'src/app/services/users.service';
import { AddUserComponent } from 'src/app/components/users/add-user/add-user.component';

import {AfterViewInit,EventEmitter, Output, Component, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {MatPaginator, } from '@angular/material/paginator';
import {MatTableDataSource, } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements AfterViewInit, OnInit, OnDestroy {

  @Output() heroesUpdated = new EventEmitter<User[]>();
   public idUser1:any;
   public users!: User[];
   subRef$?: Subscription;


  displayedColumns: string[] = ['idUser', 'id_Card', 'username', 'password',
  'role', 'names', 'phone', 'email', 'city', 'registration_date', 'acciones'];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  //users: User[] = [];
  constructor(private userService: UsersService,  private activatedRoute: ActivatedRoute){}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


   httpHeaders: HttpHeaders=new HttpHeaders();
  ngOnInit(): void {
    this.getUserList();
    this.idUser1=this.activatedRoute.snapshot.paramMap.get('idUser');
    if (this.idUser1== undefined) {
      return;
    }
    console.log(this.idUser1);
    alert(this.idUser1);
    this.userService.getUserId(this.idUser1).subscribe(data => {
      console.log('data '+data);

    });
}
delete(id:any){
  alert(id);
  let httpHeaders: HttpHeaders=new HttpHeaders();
  var token =sessionStorage.getItem('token');
  console.log('get token', token);
  httpHeaders = httpHeaders.append('Authorization','Bearer'+token);
  this.subRef$ = this.userService.delete(id).subscribe({
    next:(res) => {
      console.log('funciona', token);
      this.getUserList();

    },
    error:(error) => {
      console.log('Error al eliminar al usuario',error);
    },});
}
  getUserList() {
    this.userService.GetAllUser()
    .subscribe({
      next: (user) => {
        console.log(user);
        this.dataSource.data= user;
      },
      error:(response) =>{
        console.log(response);
      },

    });
  }
  ngOnDestroy() {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }
}
