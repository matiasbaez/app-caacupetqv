import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlantsService } from '../../../services/plants.service';
import { Plant } from '../../../interfaces/interfaces';
import { UIService } from '../../../services/ui.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-plants',
  templateUrl: './plants.page.html',
  styleUrls: ['./plants.page.scss'],
})
export class PlantsPage implements OnInit {

  angForm: FormGroup;
  plants: Observable<Plant>;
  showForm: boolean = false;
  update: boolean = false;

  constructor(
    private fb: FormBuilder,
    private plantsService: PlantsService,
    private uiService: UIService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.plants = this.plantsService.getPlants();
  }

  createForm() {
    this.angForm = this.fb.group({
      idPlanta: [''],
      nombre: ['', Validators.required],
      descripcion: [''],
      imagen: [''],
      estado: ['']
    });
  }

  onSearchChange(event) { }

  openCamera() {}

  openGallery() {}

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
