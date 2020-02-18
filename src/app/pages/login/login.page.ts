import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, IonSlides } from '@ionic/angular';
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

  angFormLogin: FormGroup;
  angFormRegister: FormGroup;
  @ViewChild('slide', { static: false }) slide: IonSlides;
  slideOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

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
    this.angFormLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.angFormRegister = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    });
  }

  async onSubmitLogin() {
    const logged = await this.userService.login(this.angFormLogin.value);
    if (logged) {
      this.router.navigate(['/']);
    } else {
      this.uiService.showAlert('El email y/o contraseña no son correctas');
    }
  }

  async onSubmitRegister() {
    await this.validateEmail();
    if (this.angFormRegister.valid) {
      const registered = await this.userService.register(this.angFormRegister.value, true);
      if (registered) {
        this.router.navigate(['/']);
      } else {
        this.uiService.showAlert('No se ha podido confirmar el registro, por favor verifique los datos');
      }
    }
  }

  async validateEmail() {
    const valid = await this.userService.validateEmail(this.angFormRegister.value.email);
    if (!valid) {
      this.uiService.showToast('El correo ya está en uso');
      this.angFormRegister.setErrors({
        email: true
      });
    }
  }

  async googleLogin() {
    const logged = await this.userService.googleLogin();
    if (logged) {
      this.router.navigate(['/']);
    } else {
      this.uiService.showAlert('Ha ocurrido un problema al intentar iniciar con Google');
    }
  }

  async facebookLogin() {
    const logged = await this.userService.facebookLogin();
    if (logged) {
      this.router.navigate(['/']);
    } else {
      this.uiService.showAlert('Ha ocurrido un problema al intentar iniciar con Facebook');
    }
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  moveSlide(pos) {
    this.slide.lockSwipes(false);
    this.slide.slideTo(pos);
    this.slide.lockSwipes(true);
  }
}
