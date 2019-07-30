import { Component, OnInit } from '@angular/core';
import { Role } from '../../../interfaces/interfaces';
import { RolesService } from '../../../services/roles.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})
export class RolesPage implements OnInit {

  roles: Role[] = [];

  constructor(
    private rolesService: RolesService
  ) { }

  ngOnInit() {
    this.rolesService.getRoles().subscribe(
      (response: any) => {
        this.roles = response.data;
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  onSearchChange(event) {
  }

  addRole() {}

}
