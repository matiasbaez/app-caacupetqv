import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnChanges } from '@angular/core';

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
    await this.getPublications();
    await this.getPlants();
    await this.getZones();
    this.angForm.controls['idUsuario'].setValue(this.user.id);
  }

  ngOnChanges() {}

  getPublications() {
    this.publicationsService.getPublications().subscribe(
      (response: any) => {
        this.publications = response.data;
      },
      (error) => { console.log('Error: ', error); }
    );
  }

  getPlants() {
    this.plantsService.getPlants().subscribe(
      (response: any) => {
        this.plants = response.data;
      },
      (error) => { console.log(' Error: ', error); }
    );
  }

  getZones() {
    this.zonesService.getZones().subscribe(
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
      idPlanta: ['', Validators.required],
      idZona: ['', Validators.required],
      descripcion: [''],
      getPosition: [false],
      latLng: [''],
      estado: [''],
      imagen: ['']
    });
  }

  onSearchChange(event) { }

  updateImage(event) {
    console.log("event: ", event);
    this.plants.forEach(plant => {
      if (plant.idPlanta === event) {
        this.angForm.controls['imagen'].setValue(plant.imagen);
      }
    });
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
    this.angForm.controls['idPlanta'].setValue(publication.planta.idPlanta);
    this.angForm.controls['idZona'].setValue(publication.zona.idZona);
    this.angForm.controls['imagen'].setValue(publication.planta.imagen);
    this.showForm = true;
    this.update = true;
  }

  reset() {
    this.showForm = false;
    this.update = false;
    this.createForm();
  }
}
