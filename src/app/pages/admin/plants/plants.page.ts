import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PlantsService } from '../../../services/plants.service';
import { Plant } from '../../../interfaces/interfaces';
import { UIService } from '../../../services/ui.service';

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

  constructor(
    private fb: FormBuilder,
    private plantsService: PlantsService,
    private uiService: UIService,
    private camera: Camera
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.plantsService.getPlants().subscribe(
      (response: any) => {
        this.plants = response.data;
      },
      (error) => {
        console.log('Error: ', error);
      }
    );
  }

  createForm() {
    this.angForm = this.fb.group({
      idPlanta: [''],
      nombre: ['', Validators.required],
      descripcion: [''],
      imagen: [''],
      imageUrl: [''],
      estado: ['']
    });
  }

  onSearchChange(event) { }

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
      this.angForm.controls['imagen'].setValue(img);
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
  }

  reset() {
    this.showForm = false;
    this.update = false;
    this.createForm();
  }
}
