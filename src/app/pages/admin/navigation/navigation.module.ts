import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NavigationPage } from './navigation.page';
import { UserGuard } from '../../../guards/user.guard';

const routes: Routes = [
  { path: '', redirectTo: 'plants' },
  {
    path: '',
    component: NavigationPage,
    children: [
      { path: 'plants', loadChildren: '../plants/plants.module#PlantsPageModule', canLoad: [UserGuard]},
      { path: 'zones', loadChildren: '../zones/zones.module#ZonesPageModule', canLoad: [UserGuard]},
      { path: 'users', loadChildren: '../users/users.module#UsersPageModule', canLoad: [UserGuard]},
      { path: 'roles', loadChildren: '../roles/roles.module#RolesPageModule', canLoad: [UserGuard]},
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NavigationPage]
})
export class NavigationPageModule {}
