import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyScrollableHostService } from '@skyux/core';

import {
  BehaviorSubject,
  distinctUntilChanged,
  fromEvent,
  map,
  switchMap,
} from 'rxjs';

import { SkyHeadingAnchorService } from '../heading-anchor/heading-anchor.service';

import { SkyTableOfContentsLink } from './table-of-contents-links';
import { SkyTableOfContentsComponent } from './table-of-contents.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyTableOfContentsComponent],
  providers: [SkyHeadingAnchorService],
  selector: 'sky-toc-page',
  styleUrl: './table-of-contents-page.component.scss',
  templateUrl: './table-of-contents-page.component.html',
})
export class SkyTableOfContentsPage {
  readonly #anchors = toSignal(inject(SkyHeadingAnchorService).anchorsChange);
  readonly #scrollableHostSvc = inject(SkyScrollableHostService);
  readonly #elementRef = inject(ElementRef);

  public menuHeadingText = input.required<string>();

  protected links = computed<SkyTableOfContentsLink[] | undefined>(() => {
    const anchors = this.#anchors();
    const activeAnchorId = this.#activeAnchorIdOnScroll();

    return anchors?.map((a) => ({
      active: a.anchorId === activeAnchorId,
      anchorId: a.anchorId,
      text: a.headingText,
    }));
  });

  readonly #loaded = new BehaviorSubject<boolean>(false);

  #scrollEl: HTMLElement | Window = window;

  public ngAfterViewInit(): void {
    this.#loaded.next(true);
  }

  public ngOnDestroy(): void {
    this.#loaded.complete();
  }

  #activeAnchorIdOnScroll = toSignal(
    this.#loaded.pipe(
      switchMap(() => {
        this.#scrollEl = this.#scrollableHostSvc.getScrollableHost(
          this.#elementRef,
        );

        return fromEvent(this.#scrollEl, 'scroll').pipe(
          map(() => this.#getActiveLink()),
        );
      }),
      distinctUntilChanged(),
    ),
  );

  /**
   * A link is considered active if the page is scrolled past the anchor without
   * also being scrolled passed the next link.
   */
  #getActiveLink(): string | undefined {
    const anchors = this.#anchors();

    if (anchors) {
      const scrollOffset =
        this.#scrollEl instanceof HTMLElement
          ? this.#scrollEl.getBoundingClientRect().top
          : 0;

      for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i];
        const nextAnchor = anchors[i + 1];

        const rect = document
          .getElementById(anchor.anchorId)
          ?.getBoundingClientRect();

        const nextRect = document
          .getElementById(nextAnchor?.anchorId)
          ?.getBoundingClientRect();

        if (
          rect &&
          rect.top - scrollOffset < 0 &&
          (nextRect === undefined || nextRect.top - scrollOffset > 0)
        ) {
          return anchor.anchorId;
        }
      }
    }

    return undefined;
  }
}
