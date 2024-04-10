import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { AddUserComponent } from './components/users/add-user/add-user.component';
import { LoginComponent } from './components/users/login/login.component';
import { ContactuserComponent } from './components/users/contactuser/contactuser.component';

const routes: Routes = [
  {
    path:'List',
    component: UsersListComponent
  },
  {
    path:'Contact',
    component: ContactuserComponent
  },
  {
    path:'addUser',
    component: AddUserComponent
  },
  {
    path:'',
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
