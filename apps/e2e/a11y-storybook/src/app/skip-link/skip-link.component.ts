import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { SkySkipLinkService } from '@skyux/a11y';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-skip-link',
  templateUrl: './skip-link.component.html',
  styleUrls: ['./skip-link.component.scss'],
  standalone: false,
})
export class SkipLinkComponent implements AfterViewInit {
  @ViewChild('skipLink', { read: ElementRef })
  public skipLink: ElementRef | undefined;

  public readonly ready = new BehaviorSubject(false);

  #skipLinkService = inject(SkySkipLinkService);

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
