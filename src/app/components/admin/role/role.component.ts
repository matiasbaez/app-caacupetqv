import { Component, OnInit, Input } from '@angular/core';
import { Role } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {

  @Input() role: Role;

  constructor() { }

  ngOnInit() {}

  editRole(role) {}

  deleteRole(role) {}

}
