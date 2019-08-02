import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UIService } from '../../services/ui.service';
import { User } from '../../interfaces/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  angForm: FormGroup;
  user: User;

  constructor(
    private userService: UserService,
    private uiService: UIService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    for (const i in this.user) {
      if (i !== 'role') {
        this.angForm.controls[i].setValue(this.user[i]);
      }
    }
    this.angForm.controls['role'].setValue(this.user.name);
    console.log('user: ', this.user);
  }

  createForm() {
    this.angForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [''],
      image: [''],
      estado: ['']
    });
  }

  async updateUser() {
    if (this.angForm.invalid) { return; }
    // const updated = await this.userService. (this.user);
    const updated = false;
    console.log('updated: ', updated);
    if (updated) {
      this.uiService.showToast('Datos de perfil actualizado');
    } else {
      this.uiService.showToast('No se puedo actualizar');
    }
  }

  logout() {
    this.userService.logout();
  }

}
