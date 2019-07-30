import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../interfaces/interfaces';
import { UserService } from '../../../services/user.service';
import { UIService } from '../../../services/ui.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Input() user: User;
  @Output() edit: EventEmitter<any> = new EventEmitter();

  constructor(
    private userService: UserService,
    private uiService: UIService
  ) { }

  ngOnInit() { }

  editUser(user) {
    this.edit.emit(user);
  }

  async deleteUser(userId) {
    const deleted = await this.userService.deleteUser(userId);
    let message;
    if (deleted) {
      message = 'El usuario ha sido eliminado';
    } else {
      message = 'Ha ocurrido un error, por favor intentelo más tarde';
    }
    this.uiService.showToast(message);
  }

}
