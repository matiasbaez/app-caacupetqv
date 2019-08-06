import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Publications, Plant, Zone } from '../../interfaces/interfaces';
import { PublicationsService } from '../../services/publications.service';
import { UIService } from '../../services/ui.service';
import { PlantsService } from '../../services/plants.service';
import { ZonesService } from '../../services/zones.service';

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

  constructor(
    private fb: FormBuilder,
    private publicationsService: PublicationsService,
    private plantsService: PlantsService,
    private zonesService: ZonesService,
    private uiService: UIService
  ) {
    this.createForm();
  }

  async ngOnInit() {
    await this.getPublications();
    await this.getPlants();
    await this.getZones();
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
        console.log('plants response: ', response);
        this.plants = response.data;
      },
      (error) => { console.log(' Error: ', error); }
    );
  }

  getZones() {
    this.zonesService.getZones().subscribe(
      (response: any) => {
        console.log('zones response: ', response);
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
    // tslint:disable-next-line: forin
    for (const i in publication) {
      if (i !== 'created_at' && i !== 'updated_at') {
        this.angForm.controls[i].setValue(publication[i]);
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
