import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { SkySkipLinkService } from '@skyux/a11y';

@Component({
  selector: 'app-skip-link',
  templateUrl: './skip-link.component.html',
  styleUrls: ['./skip-link.component.scss'],
})
export class SkipLinkComponent implements AfterViewInit {
  @ViewChild('skipLink', { read: ElementRef })
  public skipLink: ElementRef | undefined;

  #changeDetector: ChangeDetectorRef;
  #skipLinkService: SkySkipLinkService;

  constructor(
    skipLinkService: SkySkipLinkService,
    changeDetector: ChangeDetectorRef
  ) {
    this.#skipLinkService = skipLinkService;
    this.#changeDetector = changeDetector;
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

      this.#changeDetector.detectChanges();

      setTimeout(() => {
        (document.querySelector('.sky-skip-link') as HTMLElement).focus();
        (document.querySelector('.sky-skip-link') as HTMLElement).setAttribute(
          'autofocus',
          'autofocus'
        );
      }, 100);
    }
  }
}
