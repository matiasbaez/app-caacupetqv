import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  angForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private uiService: UIService,
    private menuCtrl: MenuController,
    private userService: UserService,
  ) {
    this.menuCtrl.enable(false);
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.angForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    const logged = await this.userService.login(this.angForm.value);
    if (logged) {
      this.router.navigate(['/']);
    } else {
      this.uiService.showAlert('El email y/o contraseña no son correctas');
    }
  }

  googleLogin() {
    this.userService.googleLogin();
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }
}
