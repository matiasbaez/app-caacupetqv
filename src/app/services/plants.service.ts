import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Plant } from '../interfaces/interfaces';
import { UserService } from './user.service';
import { UIService } from './ui.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PlantsService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private file: File,
    private uiService: UIService
  ) { }

  getPlants() {
    return this.http.get<Plant>(`${API}/plantas`);
  }

  searchByName(name: string) {
    const params = new HttpParams().append('name', name);
    return this.http.get<Plant>(`${API}/search/plantas`, {params});
  }

  async readImage(imgPath, callback) {
    await this.file.resolveLocalFilesystemUrl(imgPath)
    .then(entry => {
      (entry as FileEntry).file(async (file) => await this.readFile(file, callback));
    })
    .catch(err => {
      this.uiService.showToast('Ha ocurrido un error al leer el archivo.');
    });
  }

  private async readFile(file: any, callback) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], { type: file.type });
      formData.append('imagen', imgBlob, file.name);
      callback(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  addPlant(formData: FormData) {
    return new Promise(resolve => {
      const headers = new HttpHeaders().append('Authorization', 'Bearer ' + this.userService.token);
      this.http.post(`${API}/plantas`, formData, { headers }).subscribe(
        async (response: any) => {
          console.log('response: ', response);
          if (response === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.log('Error: ', error);
          resolve(false);
        }
      );
    });
  }

  updatePlant(data: Plant) {
    return new Promise(resolve => {
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.put(`${API}/plantas/${data.idPlanta}`, data, { headers }).subscribe(
        async (response: any) => {
          console.log('response: ', response);
          if (response === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.log('Error: ', error);
          resolve(false);
        }
      );
    });
  }

  deletePlant(id) {
    return new Promise(resolve => {
      const headers = new HttpHeaders()
        .append('Authorization', 'Bearer ' + this.userService.token);
      this.http.delete(`${API}/plantas/${id}`, { headers }).subscribe(
        async (response: any) => {
          console.log('response: ', response);
          if (response === 200) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (error) => {
          console.log('Error: ', error);
          resolve(false);
        }
      );
    });
  }
}
