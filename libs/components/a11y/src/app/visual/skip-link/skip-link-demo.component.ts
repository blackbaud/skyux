//#region imports

import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import {
  SkySkipLinkService
} from '../../public/public_api';

//#endregion

@Component({
  selector: 'app-skip-link-demo',
  templateUrl: './skip-link-demo.component.html',
  styleUrls: ['./skip-link-demo.component.scss']
})
export class SkipLinkDemoComponent implements AfterViewInit {

  @ViewChild('skipLink1', { read: ElementRef })
  private skipLink1: ElementRef;

  @ViewChild('skipLink2', { read: ElementRef })
  private skipLink2: ElementRef;

  constructor(
    private skipLinkService: SkySkipLinkService
  ) { }

  public ngAfterViewInit(): void {
    this.skipLinkService.setSkipLinks({
      links: [
        {
          title: 'Area 1',
          elementRef: this.skipLink1
        },
        {
          title: 'Area 2',
          elementRef: this.skipLink2
        },
        {
          title: 'Invalid area',
          elementRef: undefined
        }
      ]
    });
  }
}
