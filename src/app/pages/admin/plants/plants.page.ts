import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';

import { PlantsService } from '../../../services/plants.service';
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

  @ViewChild('infiniteScroll') infScroll: IonInfiniteScroll;
  @ViewChild('refresher') refresher: IonRefresher;

  public infScrollDisabled = false;

  constructor(
    private fb: FormBuilder,
    private plantsService: PlantsService,
    private uiService: UIService,
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
      publicaciones: [''],
      estado: ['']
    });
  }

  getPlants(event?: any, pull: boolean = false) {
    this.plantsService.getPlants(pull).subscribe(
      (response: any) => {
        this.plants.push(...response.data);
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
        this.plantsService.searchByName(event.detail.value).subscribe(
          (response: any) => {
            this.plants = response.data;
          },
          (error) => {
            console.log('Error: ', error);
          }
        );
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
    this.camera.getPicture(options).then((imageData) => {
      const img = window.Ionic.WebView.convertFileSrc(imageData);
      // console.log('path: ', img);
      console.log('imageData: ', imageData);
      this.angForm.controls['imagen'].setValue(imageData);
      this.angForm.controls['imageUrl'].setValue(img);
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
        console.log('imagen: ', this.angForm.value.imagen);
        await this.plantsService.readImage(this.angForm.value.imagen, async (result) => {
          console.log('result: ', result, result.values());
          const formData = result;
          for (const i in this.angForm.value) {
            if (i !== 'imagen' && i !== 'imageUrl' && this.angForm.value[i]) {
              formData.append(i, this.angForm.value[i]);
            }
          }
          const saved = await this.plantsService.addPlant(formData);
          if (saved) {
            message = 'La planta ha sido agregada correctamente';
            this.reset();
          } else {
            message = 'Ha ocurrido un problema, por favor intentelo más tarde';
          }
        });
      }
    } else {
      message = 'Por vafor verifique los datos';
    }
    this.infScroll.disabled = false;
    this.refresher.disabled = false;
    this.uiService.showToast(message);
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
    this.infScroll.disabled = true;
    this.refresher.disabled = true;
  }

  refresh(event) {
    this.getPlants(event, true);
    this.plants = [];
    this.infScrollDisabled = true;
  }

  addPlantForm() {
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
