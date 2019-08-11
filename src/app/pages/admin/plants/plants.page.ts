import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PlantsService } from '../../../services/plants.service';
import { DataService } from '../../../services/data.service';
import { UIService } from '../../../services/ui.service';
import { Plant } from '../../../interfaces/interfaces';

declare var window: any;

@Component({
  selector: 'app-plants',
  templateUrl: './plants.page.html',
  styleUrls: ['./plants.page.scss'],
})
export class PlantsPage implements OnInit {

  angForm: FormGroup;
  plants: Plant[] = [];
  showForm: boolean = false;
  update: boolean = false;
  public infScrollDisabled = false;

  constructor(
    private plantsService: PlantsService,
    private dataService: DataService,
    private uiService: UIService,
    private fb: FormBuilder,
    private camera: Camera
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getPlants(null, true);
    this.plantsService.newPlant.subscribe(plant => {
      this.plants.unshift(plant);
    });
  }

  createForm() {
    this.angForm = this.fb.group({
      idPlanta: [''],
      nombre: ['', Validators.required],
      descripcion: [''],
      imagen: ['', Validators.required],
      imageUrl: [''],
      estado: ['']
    });
  }

  getPlants(event?: any, pull: boolean = false) {
    this.plantsService.getPlants(pull)
    .then((response: any) => {
      const parse = this.dataService.parseData(response.data);
      this.plants.push(...parse.data);
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
        this.plantsService.searchByName(event.detail.value)
        .then((response: any) => {
          const parse = this.dataService.parseData(response.data);
          this.plants = parse.data;
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
      }
    } else { this.getPlants(); }
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    this.processImage(options);
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.processImage(options);
  }

  processImage(options: CameraOptions) {
    this.camera.getPicture(options).then(imageData => {
      const img = window.Ionic.WebView.convertFileSrc(imageData);
      // console.log('path: ', img);
      console.log('imageData: ', imageData);
      this.angForm.controls['imagen'].setValue(imageData);
      this.angForm.controls['imageUrl'].setValue(img);
      this.plantsService.uploadImage(imageData);
    }, (err) => {
      // Handle error
    });
  }

  async onSubmit() {
    let message;
    if (this.angForm.valid) {
      if (this.update) {
        const updated = await this.plantsService.updatePlant(this.angForm.value);
        if (updated) {
          message = 'La planta ha sido actualizada correctamente';
          this.reset();
        } else {
          message = 'Ha ocurrido un problema, por favor intentelo más tarde';
        }
      } else {
        const saved = await this.plantsService.addPlant(this.angForm.value);
        if (saved) {
          message = 'La planta ha sido agregada correctamente';
          this.reset();
        } else {
          message = 'Ha ocurrido un problema, por favor intentelo más tarde';
        }
      }
    } else {
      message = 'Por vafor verifique los datos';
    }
    // this.uiService.showToast(message);
  }

  editPlant(plant) {
    // tslint:disable-next-line: forin
    for (const i in plant) {
      if (i !== 'created_at' && i !== 'updated_at') {
        this.angForm.controls[i].setValue(plant[i]);
      }
    }
    this.showForm = true;
    this.update = true;
  }

  refresh(event) {
    this.getPlants(event, true);
    this.plants = [];
    this.infScrollDisabled = false;
  }

  reset() {
    this.showForm = false;
    this.update = false;
    this.createForm();
  }
}
