import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SkyMediaQueryService, SkyScrollableHostService } from '@skyux/core';

import { debounceTime, distinctUntilChanged, fromEvent, map, take } from 'rxjs';

import { SkyDocsHeadingAnchorService } from '../heading-anchor/heading-anchor.service';

import { SkyDocsTableOfContentsLink } from './table-of-contents-links';
import { SkyDocsTableOfContentsComponent } from './table-of-contents.component';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sky-docs-toc-page-with-links]': 'links().length > 0',
  },
  imports: [SkyDocsTableOfContentsComponent],
  selector: 'sky-docs-toc-page',
  styleUrl: './table-of-contents-page.component.scss',
  templateUrl: './table-of-contents-page.component.html',
})
export class SkyDocsTableOfContentsPageComponent implements AfterViewInit {
  readonly #anchors = toSignal(
    inject(SkyDocsHeadingAnchorService).anchorsChange,
  );

  readonly #destroyRef = inject(DestroyRef);
  readonly #elementRef = inject(ElementRef);
  readonly #scrollableHostSvc = inject(SkyScrollableHostService);

  public readonly menuHeadingText = input.required<string>();

  readonly #activeAnchorIdOnScroll = signal<string | undefined>(undefined);
  #scrollOffset = 0;

  protected readonly breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );

  protected readonly links = computed<SkyDocsTableOfContentsLink[]>(() => {
    if (this.breakpoint() === 'xs') {
      return [];
    }

    const anchors = this.#anchors();
    const activeAnchorId = this.#activeAnchorIdOnScroll();

    return (
      anchors?.map((anchor) => {
        const link = anchor as SkyDocsTableOfContentsLink;
        link.active = link.anchorId === activeAnchorId;
        return link;
      }) ?? []
    );
  });

  readonly #routeFragment = toSignal(
    inject(ActivatedRoute).fragment.pipe(take(1)),
  );
  readonly #doc = inject(DOCUMENT);

  #delayedScroll: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const fragment = this.#routeFragment();
      const anchors = this.#anchors();
      if (fragment && anchors?.some((anchor) => anchor.anchorId === fragment)) {
        this.#delayedScroll = setTimeout(() =>
          this.#doc.getElementById(fragment)?.scrollIntoView(),
        );
      }
    });
  }

  public ngAfterViewInit(): void {
    const scrollEl = this.#scrollableHostSvc.getScrollableHost(
      this.#elementRef,
    );

    this.#scrollOffset = this.#getScrollOffset(scrollEl);

    fromEvent(scrollEl, 'scroll')
      .pipe(
        debounceTime(10),
        map(() => this.#getActiveLink()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((activeLink) => {
        clearTimeout(this.#delayedScroll);
        this.#activeAnchorIdOnScroll.set(activeLink);
      });
  }

  /**
   * A link is considered active if the page is scrolled past the anchor without
   * also being scrolled passed the next link.
   */
  #getActiveLink(): string | undefined {
    const anchors = this.#anchors();

    if (anchors) {
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
          Math.round(rect.top - this.#scrollOffset) <= 0 &&
          (nextRect === undefined ||
            Math.round(nextRect.top - this.#scrollOffset) > 0)
        ) {
          return anchor.anchorId;
        }
      }
    }

    return undefined;
  }

  #getScrollOffset(scrollEl: HTMLElement | Window): number {
    return scrollEl instanceof HTMLElement
      ? scrollEl.getBoundingClientRect().top
      : 0;
  }
}
