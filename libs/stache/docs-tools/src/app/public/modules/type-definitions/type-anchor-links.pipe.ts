import {
  Pipe,
  PipeTransform
} from '@angular/core';

import {
  SkyDocsAnchorLinkService
} from './anchor-link.service';

@Pipe({
  name: 'skyDocsTypeAnchorLinks',
  pure: true
})
export class SkyDocsTypeAnchorLinksPipe implements PipeTransform {

  constructor(
    private anchorLinkService: SkyDocsAnchorLinkService
  ) { }

  public transform(value: string): string {
    return this.anchorLinkService.applyTypeAnchorLinks(value);
  }

}
