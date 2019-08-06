import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Publications } from 'src/app/interfaces/interfaces';
import { PublicationsService } from 'src/app/services/publications.service';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.scss'],
})
export class PublicationComponent implements OnInit {

  @Input() publication: Publications;
  @Output() edit: EventEmitter<any> = new EventEmitter();

  constructor(
    private publicationsService: PublicationsService,
    private uiService: UIService
  ) { }

  ngOnInit() { }

  editPublication(publication) {
    this.edit.emit(publication);
  }

  async deletePublication(publicationId) {
    const control = await this.uiService.showConfirmAlert('¿Estas seguro de realizar está acción?');
    if (control) {
      const deleted = await this.publicationsService.deletePublication(publicationId);
      let message;
      if (deleted) {
        message = 'La publicación ha sido eliminada';
      } else {
        message = 'Ha ocurrido un error, por favor intentelo más tarde';
      }
      this.uiService.showToast(message);
    }
  }

}
