
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Injectable, EventEmitter } from '@angular/core';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../environments/environment';
import { Plant } from '../interfaces/interfaces';
import { UserService } from './user.service';
import { UIService } from './ui.service';
import { DataService } from './data.service';

const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class PlantsService {

  page = 0;
  newPlant = new EventEmitter<Plant>();

  constructor(
    private fileTransfer: FileTransfer,
    private dataService: DataService,
    private userService: UserService,
    private uiService: UIService,
    private http: HTTP,
    private file: File
  ) { }

  getPlants(pull: boolean = false) {
    if (pull) { this.page = 0; }
    this.page++;
    return this.http.get(`${API}/plantas?page=${this.page}`, {}, {});
  }

  searchByName(name: string) {
    return this.http.get(`${API}/search/plantas`, { name }, {});
  }

  async readImage(imgPath, callback) {
    await this.file.resolveLocalFilesystemUrl(imgPath)
    .then(entry => {
      (entry as FileEntry).file(async (file) => await this.readFile(file, callback));
    })
    .catch(err => {
      console.log('Error: ', err);
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

  uploadImage(image: string) {
    const options: FileUploadOptions = {
      fileKey: 'imagen',
      headers: {
        Authorization: 'Bearer ' + this.userService.token
      }
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    fileTransfer.upload(image, `${API}/upload`, options)
    .then(response => {
      console.log(response);
    }).catch(err => {
      console.log('Error al subir la imagen: ', err);
    });
  }

  addPlant(formData) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.setDataSerializer('urlencoded');
      this.http.post(`${API}/plantas`, formData, {})
      .then(async (response: any) => {
        const parse = this.dataService.parseData(response.data);
        console.log('response: ', response);
        if (parse.success) {
          this.newPlant.emit(parse.plant);
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        resolve(false);
      });
    });
  }

  updatePlant(data: Plant) {
    data['_method'] = 'PUT';
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.post(`${API}/plantas/${data.idPlanta}`, data, {})
      .then(async (response: any) => {
        console.log('response: ', response);
        const parse = this.dataService.parseData(response.data);
        if (parse.success) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        resolve(false);
      });
    });
  }

  deletePlant(id) {
    return new Promise(resolve => {
      this.http.setHeader('*', 'Authorization', `Bearer ${this.userService.token}`);
      this.http.post(`${API}/plantas/${id}`, {_method: 'DELETE'}, {})
      .then(async (response: any) => {
        console.log('response: ', response);
        const parse = this.dataService.parseData(response.data);
        if (parse.success) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        resolve(false);
      });
    });
  }
}
