import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { Role } from '../../../interfaces/interfaces';
import { RolesService } from '../../../services/roles.service';
import { UIService } from '../../../services/ui.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
})
export class RolesPage implements OnInit {

  angForm: FormGroup;
  roles: Role[] = [];
  showForm: boolean = false;
  update: boolean = false;

  @ViewChild('infiniteScroll', {static: false}) infScroll: IonInfiniteScroll;
  @ViewChild('refresher', {static: false}) refresher: IonRefresher;

  public infScrollDisabled = false;

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private uiService: UIService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getRoles(null, true);
    this.rolesService.newRole.subscribe(role => {
      this.roles.unshift(role);
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      idRole: [''],
      nombre: ['', Validators.required],
      estado: [''],
      flag: ['', [Validators.required, Validators.maxLength(1)]]
    });
  }

  getRoles(event?, pull: boolean = false) {
    this.rolesService.getRoles(pull).subscribe(
      (response: any) => {
        this.roles.push(...response.data);
        if (event) {
          event.target.disabled = true;
          event.target.complete();

          if (response.data.length === 0) { this.infScrollDisabled = true; }

          setTimeout(() => {
            event.target.disabled = false;
          }, 100);
        }
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  onSearchChange(event: any) {
    if (event.detail.value !== '') {
      if (event.detail.value.length >= 3) {
        this.rolesService.searchByName(event.detail.value).subscribe(
          (response: any) => {
            this.roles = response.data;
          },
          (error) => {
            console.log('Error: ', error);
          }
        );
      }
    } else { this.roles = []; this.getRoles(null, true); }
  }

  async onSubmit() {
    let message;
    if (this.angForm.valid) {
      if (this.update) {
        const updated = await this.rolesService.updateRole(this.angForm.value);
        if (updated) {
          message = 'El rol ha sido actualizado correctamente';
          this.reset();
        } else {
          message = 'Ha ocurrido un problema, por favor intentelo más tarde';
        }
      } else {
        const saved = await this.rolesService.addRole(this.angForm.value);
        if (saved) {
          message = 'El rol ha sido agregado correctamente';
          this.reset();
        } else {
          message = 'Ha ocurrido un problema, por favor intentelo más tarde';
        }
      }
    } else {
      message = 'Por vafor verifique los datos';
    }
    this.infScroll.disabled = false;
    this.refresher.disabled = false;
    this.uiService.showToast(message);
  }

  editRole(role) {
    // tslint:disable-next-line: forin
    for (const i in role) {
      if (i !== 'created_at' && i !== 'updated_at') {
        this.angForm.controls[i].setValue(role[i]);
      }
    }
    this.showForm = true;
    this.update = true;
    this.infScroll.disabled = true;
    this.refresher.disabled = true;
  }

  refresh(event) {
    this.getRoles(event, true);
    this.roles = [];
    this.infScrollDisabled = false;
  }

  addRoleForm() {
    this.showForm = true;
    this.infScroll.disabled = true;
    this.refresher.disabled = true;
  }

  reset() {
    this.showForm = false;
    this.update = false;
    this.infScroll.disabled = false;
    this.refresher.disabled = false;
    this.createForm();
  }

}
