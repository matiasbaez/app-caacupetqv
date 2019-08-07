import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'login-register', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'mision-vision', loadChildren: './pages/mision-vision/mision-vision.module#MisionVisionPageModule' },
  { path: 'publications', loadChildren: './pages/publications/publications.module#PublicationsPageModule', canLoad: [UserGuard] },
  { path: 'donate', loadChildren: './pages/donate/donate.module#DonatePageModule' },
  { path: 'admin', loadChildren: './pages/admin/navigation/navigation.module#NavigationPageModule', canLoad: [UserGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
