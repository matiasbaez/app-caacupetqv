import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { PlantComponent } from './admin/plant/plant.component';
import { ZoneComponent } from './admin/zone/zone.component';
import { UserComponent } from './admin/user/user.component';
import { RoleComponent } from './admin/role/role.component';

@NgModule({
  declarations: [
    HeaderComponent,
    PlantComponent,
    ZoneComponent,
    UserComponent,
    RoleComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    PlantComponent,
    ZoneComponent,
    UserComponent,
    RoleComponent
  ]
})
export class ComponentsModule { }
