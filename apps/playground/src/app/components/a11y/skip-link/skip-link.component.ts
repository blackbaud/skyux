//#region imports
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SkySkipLinkService } from '@skyux/a11y';

//#endregion

@Component({
  selector: 'app-skip-link',
  templateUrl: './skip-link.component.html',
  styleUrls: ['./skip-link.component.scss'],
})
export class SkipLinkComponent implements AfterViewInit {
  @ViewChild('skipLink1', { read: ElementRef })
  private skipLink1: ElementRef;

  @ViewChild('skipLink2', { read: ElementRef })
  private skipLink2: ElementRef;

  constructor(private skipLinkService: SkySkipLinkService) {}

  public ngAfterViewInit(): void {
    this.skipLinkService.setSkipLinks({
      links: [
        {
          title: 'Area 1',
          elementRef: this.skipLink1,
        },
        {
          title: 'Area 2',
          elementRef: this.skipLink2,
        },
        {
          title: 'Invalid area',
          elementRef: undefined,
        },
      ],
    });
  }
}
