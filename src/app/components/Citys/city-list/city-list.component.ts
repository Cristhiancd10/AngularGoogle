import { City } from 'src/app/models/city_model';
import { CityService } from 'src/app/services/city.service';

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
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.css'],
})
export class CityListComponent implements AfterViewInit, OnInit, OnDestroy {
  role: string = ''; // Variable que almacena el rol del usuario

  @Output() heroesUpdated = new EventEmitter<City[]>();
  public idUser1: any;
  public users!: City[];
  subRef$?: Subscription;

  displayedColumns: string[] = [
    'id',
    'nombre',
    'codigoPostal',
  ];
  dataSource = new MatTableDataSource<City>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  //users: User[] = [];
  constructor(
    private cityService:CityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    const storedRole = localStorage.getItem('role');
    this.role = storedRole !== null ? storedRole : '';
    if (this.role === 'Administrador') {
      this.displayedColumns = [
        'id',
        'nombre',
        'codigoPostal',

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
    this.idUser1 = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idUser1 == undefined) {
      return;
    }
    alert(this.idUser1);
    this.cityService.getCityId(this.idUser1).subscribe((data) => {});
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cityService.delete(id).subscribe(() => {
          console.log('deleted');
          this.getUserList();
        });
      } else {
        console.log('Eliminación cancelada');
      }
    });
  }
  getUserList() {
    this.subRef$ = this.cityService.GetAllCity().subscribe({
      next: (city) => {
        this.dataSource.data = city;
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


}
