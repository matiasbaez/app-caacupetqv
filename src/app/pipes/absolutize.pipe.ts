import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'absolutize'
})
export class AbsolutizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) { return '/assets/img/logo-2.jpg'; }

    return environment.imageUrl + '/' + value;
  }

}
