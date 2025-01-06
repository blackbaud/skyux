import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { SkySkipLinkService } from '@skyux/a11y';
import { FontLoadingService } from '@skyux/storybook/font-loading';

import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-skip-link',
  templateUrl: './skip-link.component.html',
  styleUrls: ['./skip-link.component.scss'],
  standalone: false,
})
export class SkipLinkComponent implements AfterViewInit, OnDestroy {
  @ViewChild('skipLink', { read: ElementRef })
  public skipLink: ElementRef | undefined;

  public readonly ready = new BehaviorSubject(false);

  #fontLoadingService = inject(FontLoadingService);
  #skipLinkService = inject(SkySkipLinkService);
  #subscriptions = new Subscription();

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
    this.#subscriptions.add(
      this.#fontLoadingService.ready().subscribe(() => {
        this.ready.next(true);
      }),
    );
  }

  public ngOnDestroy(): void {
    this.#subscriptions.unsubscribe();
  }
}
