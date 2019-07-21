import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  angForm: FormGroup;

  constructor(
    private menuCtrl: MenuController,
    private fb: FormBuilder,
    private dataService: DataService,
    private storage: Storage,
    private alertCtrl: AlertController,
    private router: Router
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

  onSubmit() {
    this.dataService.login(this.angForm.value).subscribe(
      (response: any) => {
        this.storage.set('token', response.token);
        this.router.navigate(['/']);
      },
      async (error) => {
        console.log('Error: ', error);
        const alert = await this.alertCtrl.create({
          header: 'ATENCIÓN',
          message: 'El email y/o la contraseña no son correctas.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }
}
