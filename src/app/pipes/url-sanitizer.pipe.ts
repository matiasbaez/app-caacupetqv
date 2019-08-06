import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'urlSanitizer'
})
export class UrlSanitizerPipe implements PipeTransform {

  constructor(
    private domSanitizer: DomSanitizer
  ) {}

  transform(url: any): any {
    const index = url.indexOf('assets');
    if (index !== -1) { return url; }
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

}
