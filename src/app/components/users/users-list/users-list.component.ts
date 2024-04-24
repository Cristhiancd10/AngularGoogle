import { User } from 'src/app/models/user_model';
import { UsersService } from 'src/app/services/users.service';

import {
  AfterViewInit,
  EventEmitter,
  Output,
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements AfterViewInit, OnInit, OnDestroy {
  role: string = ''; // Variable que almacena el rol del usuario

  @Output() heroesUpdated = new EventEmitter<User[]>();
  public idUser1: any;
  public users!: User[];
  subRef$?: Subscription;

  displayedColumns: string[] = [
    'idUser',
    'id_Card',
    'username',
    'password',
    'role',
    'names',
    'phone',
    'email',
    'city',
    'registration_date',
    'acciones',
  ];
  dataSource = new MatTableDataSource<User>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  //users: User[] = [];
  constructor(
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    const storedRole = localStorage.getItem('role');
    this.role = storedRole !== null ? storedRole : '';
    if (this.role === 'Administrador') {
      this.displayedColumns = [
        'idUser',
        'id_Card',
        'username',
        'password',
        'role',
        'names',
        'phone',
        'email',
        'city',
        'registration_date',
        'acciones',
      ];
    } else {
      this.displayedColumns = [
        'idUser',
        'id_Card',
        'username',
        'password',
        'role',
        'names',
        'phone',
        'email',
        'city',
        'registration_date',
      ];
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  httpHeaders: HttpHeaders = new HttpHeaders();
  ngOnInit(): void {
    this.getUserList();
    this.idUser1 = this.activatedRoute.snapshot.paramMap.get('idUser');
    if (this.idUser1 == undefined) {
      return;
    }
    alert(this.idUser1);
    this.userService.getUserId(this.idUser1).subscribe((data) => {});
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.delete(id).subscribe(() => {
          console.log('deleted');
          this.getUserList();
        });
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }
  getUserList() {
    this.subRef$ = this.userService.GetAllUser().subscribe({
      next: (user) => {
        this.dataSource.data = user;
        console.log('Co ' + this.dataSource.data);
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  ngOnDestroy() {
    if (this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }
}
