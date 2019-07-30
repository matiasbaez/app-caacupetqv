import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Role } from '../../../interfaces/interfaces';
import { RolesService } from '../../../services/roles.service';
import { UIService } from '../../../services/ui.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {

  @Input() role: Role;
  @Output() edit: EventEmitter<any> = new EventEmitter();

  constructor(
    private rolesService: RolesService,
    private uiService: UIService
  ) { }

  ngOnInit() {}

  editRole(role) {
    this.edit.emit(role);
  }

  async deleteRole(roleId) {
    const deleted = await this.rolesService.deleteRole(roleId);
    let message;
    if (deleted) {
      message = 'El rol ha sido eliminado';
    } else {
      message = 'Ha ocurrido un error, por favor intentelo más tarde';
    }
    this.uiService.showToast(message);
  }

}
