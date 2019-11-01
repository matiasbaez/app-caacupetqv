import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';
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

  @ViewChild('infiniteScroll') infScroll: IonInfiniteScroll;
  @ViewChild('refresher') refresher: IonRefresher;

  public infScrollDisabled = false;

  constructor(
    private fb: FormBuilder,
    private zonesService: ZonesService,
    private uiService: UIService
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
    this.zonesService.getZones(pull).subscribe(
      (response: any) => {
        this.zones.push(...response.data);
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
        this.zonesService.searchByName(event.detail.value).subscribe(
          (response: any) => {
            this.zones = response.data;
          },
          (error) => {
            console.log('Error: ', error);
          }
        );
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
    this.infScroll.disabled = false;
    this.refresher.disabled = false;
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
    this.infScroll.disabled = true;
    this.refresher.disabled = true;
  }

  refresh(event) {
    this.getZones(event, true);
    this.zones = [];
    this.infScrollDisabled = false;
  }

  addZoneForm() {
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
