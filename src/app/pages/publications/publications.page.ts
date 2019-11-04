import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { IonRefresher, IonInfiniteScroll } from '@ionic/angular';

import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

import { Publications, Plant, Zone, User } from '../../interfaces/interfaces';
import { PublicationsService } from '../../services/publications.service';
import { PlantsService } from '../../services/plants.service';
import { ZonesService } from '../../services/zones.service';
import { UserService } from '../../services/user.service';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.page.html',
  styleUrls: ['./publications.page.scss'],
})
export class PublicationsPage implements OnInit, OnChanges {

  angForm: FormGroup;
  publications: Publications[] = [];
  plants: Plant[] = [];
  zones: Zone[] = [];
  showForm: boolean = false;
  update: boolean = false;
  user: User;
  loadingLocation: boolean = false;

  @ViewChild('infiniteScroll') infScroll: IonInfiniteScroll;
  @ViewChild('refresher') refresher: IonRefresher;

  public infScrollDisabled = false;

  constructor(
    private publicationsService: PublicationsService,
    private locationAccuracy: LocationAccuracy,
    private plantsService: PlantsService,
    private zonesService: ZonesService,
    private userService: UserService,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private uiService: UIService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  async ngOnInit() {
    this.user = this.userService.getUser();
    await this.getPublications(null, true);
    await this.getPlants(true);
    await this.getZones(true);
    this.angForm.controls['idUsuario'].setValue(this.user.id);
    this.publicationsService.newPublication.subscribe(publication => {
      this.publications.unshift(publication);
    });
  }

  ngOnChanges() {}

  getPublications(event?, pull: boolean = false) {
    this.publicationsService.getPublications(pull).subscribe(
      (response: any) => {
        this.publications.push(...response.data);
        if (event) {
          event.target.disabled = true;
          event.target.complete();

          if (response.data.length === 0) { this.infScrollDisabled = true; }

          setTimeout(() => {
            event.target.disabled = false;
          }, 100);
        }
      },
      (error) => { console.log('Error: ', error); }
    );
  }

  getPlants(pull?) {
    this.plantsService.getPlants(pull).subscribe(
      (response: any) => {
        this.plants = response.data;
      },
      (error) => { console.log(' Error: ', error); }
    );
  }

  getZones(pull?) {
    this.zonesService.getZones(pull).subscribe(
      (response: any) => {
        this.zones = response.data;
      },
      (error) => { console.log(' Error: ', error); }
    );
  }

  createForm() {
    this.angForm = this.fb.group({
      idPublicacion: [''],
      idUsuario: ['', Validators.required],
      planta: ['', Validators.required],
      zona: ['', Validators.required],
      descripcion: ['', Validators.required],
      getPosition: [false],
      latLng: [''],
      estado: [''],
      imagen: ['']
    });
  }

  onSearchChange(event) {
    if (event.detail.value !== '') {
      if (event.detail.value.length >= 3) {
        this.publicationsService.searchBy(event.detail.value).subscribe(
          (response: any) => {
            console.log('response: ', response);
            this.publications = response.data;
          },
          (error) => {
            console.log('Error: ', error);
          }
        );
      }
    } else { this.publications = []; this.getPublications(null, true); }
  }

  updateImage(event) {
    console.log('event: ', event);
    this.plants.forEach(plant => {
      if (plant.idPlanta === event) {
        this.angForm.controls['imagen'].setValue(plant.imagen);
      }
    });
  }

  selectableChange(event) {
    // console.log('event: ', event, event.component.itemValueField);
    // const field = event.component.itemValueField;
    // this.angForm.controls[field].setValue(event.value[field]);
  }

  onToggleLocation() {
    if (!this.angForm.value.getPosition) {
      this.angForm.controls['latLng'].setValue('');
      return;
    }

    this.checkGPSPermission();
  }

  checkGPSPermission() {
    this.diagnostic.getLocationAuthorizationStatus()
    .then(response => {
      if (response === 'GRANTED') { this.checkGPSEnabled(); }
      else { this.cantGetLocation(); }
    })
    .catch(err => {
      console.log('Error: ', err);
    });
  }

  checkGPSEnabled() {
    this.diagnostic.isGpsLocationEnabled()
    .then(response => {
      console.log('response: ', response);
      if (response) {  this.getLocation(); }
      else { this.askToTurnOnGPS(); }
    })
    .catch(err => {
      console.log('error', err);
      this.cantGetLocation();
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
    .then(() => this.getLocation())
    .catch(err => {
      console.log('Err: ', err);
      this.cantGetLocation();
    });
  }

  getLocation() {
    this.loadingLocation = true;
    this.geolocation.getCurrentPosition().then((response) => {
      console.log('response: ', response);
      const coords = `${response.coords.latitude},${response.coords.longitude}`;
      this.loadingLocation = false;
      this.angForm.controls['latLng'].setValue(coords);
    }).catch((error) => {
      console.log('Error getting location', error);
      this.loadingLocation = false;
    });
  }

  cantGetLocation() {
    this.loadingLocation = false;
    this.angForm.controls['getPosition'].setValue(false);
    this.uiService.showToast('No se puede obtener la ubicación');
  }

  async onSubmit() {
    let message;
    if (this.angForm.valid) {
      if (this.update) {
        const updated = await this.publicationsService.updatePublication(this.angForm.value);
        if (updated) {
          message = 'Tu plantación ha sido actualizado correctamente';
          this.publications = [];
          await this.getPublications(null, true);
          this.reset();
        } else {
          message = 'Ha ocurrido un problema, por favor intentelo más tarde';
        }
      } else {
        const saved = await this.publicationsService.addPublication(this.angForm.value);
        if (saved) {
          message = 'Tu plantación ha sido registrado correctamente';
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

  editPublication(publication) {
    const ignore = ['created_at', 'updated_at', 'planta', 'usuario', 'zona'];
    // tslint:disable-next-line: forin
    for (const i in publication) {
      if (ignore.indexOf(i) === -1) {
        this.angForm.controls[i].setValue(publication[i]);
      }
    }
    this.angForm.controls['idUsuario'].setValue(publication.usuario.id);
    this.angForm.controls['planta'].setValue(publication.planta);
    this.angForm.controls['zona'].setValue(publication.zona);
    this.angForm.controls['imagen'].setValue(publication.planta.imagen);
    this.showForm = true;
    this.update = true;
    this.infScroll.disabled = true;
    this.refresher.disabled = true;
  }

  refresh(event) {
    this.getPublications(event, true);
    this.publications = [];
    this.infScrollDisabled = false;
  }

  addPublicationForm() {
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
    this.angForm.controls['idUsuario'].setValue(this.user.id);
  }
}
