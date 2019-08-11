import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, Role } from '../../../interfaces/interfaces';
import { UserService } from '../../../services/user.service';
import { UIService } from '../../../services/ui.service';
import { RolesService } from '../../../services/roles.service';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  angForm: FormGroup;
  users: User[] = [];
  roles: Role[] = [];
  showForm: boolean = false;
  update: boolean = false;
  public infScrollDisabled = false;

  constructor(
    private rolesService: RolesService,
    private dataService: DataService,
    private userService: UserService,
    private uiService: UIService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getUsers();
    this.getRoles();
  }

  createForm() {
    this.angForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      image: [''],
      role: [''],
      estado: ['']
    });
  }

  getUsers(event?, pull: boolean = false) {
    this.userService.getUserList(pull)
    .then((response: any) => {
      const parse = this.dataService.parseData(response.data);
      this.users.push(...parse.data);
      if (event) {
        event.target.complete();

        if (parse.data.length === 0) { this.infScrollDisabled = true; }
      }
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  }

  getRoles() {
    this.rolesService.getRoles()
    .then((response: any) => {
      const parse = this.dataService.parseData(response.data);
      this.roles = parse.data;
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  }

  onSearchChange(event: any) {
    if (event.detail.value !== '') {
      if (event.detail.value.length >= 3) {
        this.userService.searchByName(event.detail.value)
        .then((response: any) => {
          const parse = this.dataService.parseData(response.data);
          this.users = parse.data;
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
      }
    } else { this.getUsers(); }
  }

  async onSubmitCreate() {
    let message;
    await this.validateEmail();
    if (this.angForm.valid) {
      const saved = await this.userService.register(this.angForm.value, false);
      if (saved) {
        message = 'El usuario ha sido creado correctamente';
        this.reset();
      } else {
        message = 'Ha ocurrido un problema, por favor intentelo más tarde';
      }
      this.uiService.showToast(message);
    }
  }

  async onSubmitUpdate() {
    let message;
    if (this.angForm.valid && this.update) {
      // const updated = await this.userService.updateUser(this.angForm.value);
      const updated = false;
      if (updated) {
        message = 'El usuario ha sido actualizado correctamente';
        this.reset();
      } else {
        message = 'Ha ocurrido un problema, por favor intentelo más tarde';
      }
    }
    this.uiService.showToast(message);
  }

  async validateEmail() {
    const valid = await this.userService.validateEmail(this.angForm.value.email);
    if (!valid) {
      this.uiService.showToast('El correo ya está en uso');
      this.angForm.setErrors({
        email: true
      });
    }
  }

  editUser(user) {
    // tslint:disable-next-line: forin
    for (const i in user) {
      if (i !== 'created_at' && i !== 'updated_at' && i !== 'role') {
        this.angForm.controls[i].setValue(user[i]);
      } else if (i === 'role') { this.angForm.controls[i].setValue(user[i].idRole); }
    }
    this.showForm = true;
    this.update = true;
  }

  refresh(event) {
    this.getUsers(event, true);
    this.users = [];
    this.infScrollDisabled = false;
  }

  reset() {
    this.showForm = false;
    this.update = false;
    this.createForm();
  }

}
