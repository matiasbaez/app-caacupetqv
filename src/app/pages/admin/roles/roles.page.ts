import { Component, OnInit } from '@angular/core';
import { Role } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})
export class RolesPage implements OnInit {

  roles: Role[] = [];

  constructor() { }

  ngOnInit() {
  }

  onSearchChange(event) {
  }

  addRole() {}

}
