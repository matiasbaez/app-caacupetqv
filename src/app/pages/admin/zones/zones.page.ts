import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Zone } from '../../../interfaces/interfaces';
import { UIService } from '../../../services/ui.service';
import { ZonesService } from '../../../services/zones.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.page.html',
  styleUrls: ['./zones.page.scss'],
})
export class ZonesPage implements OnInit {

  angForm: FormGroup;
  zones: Zone[] = [];
  showForm: boolean = false;
  update: boolean = false;

  constructor(
    private fb: FormBuilder,
    private zonesService: ZonesService,
    private uiService: UIService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.zonesService.getZones().subscribe(
      (response: any) => {
        this.zones = response.data;
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  createForm() {
    this.angForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [''],
      idZona: ['']
    });
  }

  onSearchChange(event) {

  }

  async onSubmit() {
    let message;
    if (this.angForm.valid) {
      if (this.update) {
        const updated = await this.zonesService.updateZone(this.angForm.value);
        if (updated) {
          message = 'La zona ha sido actualizada correctamente';
          this.reset();
        } else {
          message = 'Ha ocurrido un problema, por favor intentelo más tarde';
        }
      } else {
        const saved = await this.zonesService.addZone(this.angForm.value);
        if (saved) {
          message = 'La zona ha sido agregada correctamente';
          this.reset();
        } else {
          message = 'Ha ocurrido un problema, por favor intentelo más tarde';
        }
      }
    } else {
      message = 'Por vafor verifique los datos';
    }
    this.uiService.showToast(message);
  }

  editZone(zone) {
    // tslint:disable-next-line: forin
    for (const i in zone) {
      if (i !== 'created_at' && i !== 'updated_at') {
        this.angForm.controls[i].setValue(zone[i]);
      }
    }
    this.showForm = true;
    this.update = true;
  }

  reset() {
    this.showForm = false;
    this.update = false;
    this.createForm();
  }

}
