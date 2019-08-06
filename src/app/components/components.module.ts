import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { PlantComponent } from './admin/plant/plant.component';
import { ZoneComponent } from './admin/zone/zone.component';
import { UserComponent } from './admin/user/user.component';
import { RoleComponent } from './admin/role/role.component';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { PublicationComponent } from './publication/publication.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    HeaderComponent,
    PlantComponent,
    ZoneComponent,
    UserComponent,
    RoleComponent,
    AvatarSelectorComponent,
    PublicationComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PipesModule
  ],
  exports: [
    HeaderComponent,
    PlantComponent,
    ZoneComponent,
    UserComponent,
    RoleComponent,
    AvatarSelectorComponent,
    PublicationComponent
  ]
})
export class ComponentsModule { }
