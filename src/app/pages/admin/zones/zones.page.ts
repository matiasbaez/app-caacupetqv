import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZonesService } from '../../../services/zones.service';
import { DataService } from '../../../services/data.service';
import { UIService } from '../../../services/ui.service';
import { Zone } from '../../../interfaces/interfaces';

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
  public infScrollDisabled = false;

  constructor(
    private zonesService: ZonesService,
    private dataService: DataService,
    private uiService: UIService,
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getZones();
  }

  createForm() {
    this.angForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: [''],
      idZona: ['']
    });
  }

  getZones(event?, pull: boolean = false) {
    this.zonesService.getZones(pull)
    .then((response: any) => {
      const parse = this.dataService.parseData(response.data);
      this.zones.push(...parse.data);
      if (event) {
        event.target.complete();

        if (parse.data.length === 0) { this.infScrollDisabled = true; }
      }
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  }

  onSearchChange(event: any) {
    if (event.detail.value !== '') {
      if (event.detail.value.length >= 3) {
        this.zonesService.searchByName(event.detail.value)
        .then((response: any) => {
          const parse = this.dataService.parseData(response.data);
          this.zones = parse.data;
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
      }
    } else { this.getZones(null, true); }
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

  refresh(event) {
    this.getZones(event, true);
    this.zones = [];
    this.infScrollDisabled = false;
  }

  reset() {
    this.showForm = false;
    this.update = false;
    this.createForm();
  }

}
