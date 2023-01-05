import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SkySkipLinkService } from '@skyux/a11y';

@Component({
  selector: 'app-skip-link',
  templateUrl: './skip-link.component.html',
  styleUrls: ['./skip-link.component.scss'],
})
export class SkipLinkComponent implements AfterViewInit {
  @ViewChild('skipLink', { read: ElementRef })
  public skipLink: ElementRef | undefined;

  #skipLinkService: SkySkipLinkService;

  constructor(skipLinkService: SkySkipLinkService) {
    this.#skipLinkService = skipLinkService;
  }

  public ngAfterViewInit(): void {
    if (this.skipLink) {
      this.#skipLinkService.setSkipLinks({
        links: [
          {
            title: 'Area 1',
            elementRef: this.skipLink,
          },
        ],
      });
    }
  }
}
