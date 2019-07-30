import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Zone } from '../../../interfaces/interfaces';
import { ZonesService } from '../../../services/zones.service';
import { UIService } from '../../../services/ui.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZoneComponent implements OnInit {

  @Input() zone: Zone;
  @Output() edit: EventEmitter<any> = new EventEmitter();

  constructor(
    private zonesService: ZonesService,
    private uiService: UIService
  ) { }

  ngOnInit() {}

  editZone(zone) {
    this.edit.emit(zone);
  }

  async deleteZone(zoneId) {
    const deleted = await this.zonesService.deleteZone(zoneId);
    let message;
    if (deleted) {
      message = 'La zona ha sido eliminada';
    } else {
      message = 'Ha ocurrido un error, por favor intentelo más tarde';
    }
    this.uiService.showToast(message);
  }

}
