import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NavigationPage } from './navigation.page';

const routes: Routes = [
  { path: '', redirectTo: 'plants' },
  {
    path: '',
    component: NavigationPage,
    children: [
      { path: 'plants', loadChildren: '../plants/plants.module#PlantsPageModule'},
      { path: 'zones', loadChildren: '../zones/zones.module#ZonesPageModule'},
      { path: 'users', loadChildren: '../users/users.module#UsersPageModule'},
      { path: 'roles', loadChildren: '../roles/roles.module#RolesPageModule'},
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
