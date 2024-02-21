import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { LoginComponent } from './components/users/login/login.component';

const routes: Routes = [
  {
    path:'',
    component: UsersListComponent
  },
  {
    path:'addUser',
    component: AddUserComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'users/editUser1/:idUser',
    component: AddUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
