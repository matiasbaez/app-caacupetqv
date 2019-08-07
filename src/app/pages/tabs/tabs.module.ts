import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { UserGuard } from '../../guards/user.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home' },
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'home', loadChildren: '../home/home.module#HomePageModule' },
      { path: 'profile', loadChildren: '../profile/profile.module#ProfilePageModule', canLoad: [UserGuard] },
      { path: 'donate', loadChildren: '../donate/donate.module#DonatePageModule' },
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
  declarations: [TabsPage]
})
export class TabsPageModule {}
