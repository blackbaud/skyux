import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyScrollableHostService } from '@skyux/core';

import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

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
export class SkyTableOfContentsPageComponent implements AfterViewInit {
  readonly #anchors = toSignal(inject(SkyHeadingAnchorService).anchorsChange);
  readonly #scrollableHostSvc = inject(SkyScrollableHostService);
  readonly #elementRef = inject(ElementRef);

  public readonly menuHeadingText = input.required<string>();

  readonly #activeAnchorIdOnScroll = signal<string | undefined>(undefined);
  #scrollEl: HTMLElement | Window = window;

  protected readonly links = computed<SkyTableOfContentsLink[] | undefined>(
    () => {
      const anchors = this.#anchors();
      const activeAnchorId = this.#activeAnchorIdOnScroll();

      return anchors?.map((a) => ({
        active: a.anchorId === activeAnchorId,
        anchorId: a.anchorId,
        text: a.text,
      }));
    },
  );

  public ngAfterViewInit(): void {
    this.#scrollEl = this.#scrollableHostSvc.getScrollableHost(
      this.#elementRef,
    );

    fromEvent(this.#scrollEl, 'scroll')
      .pipe(
        debounceTime(10),
        map(() => this.#getActiveLink()),
        distinctUntilChanged(),
      )
      .subscribe((activeLink) => {
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
      const scrollOffset = this.#getScrollOffset();

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

  #getScrollOffset(): number {
    return this.#scrollEl instanceof HTMLElement
      ? this.#scrollEl.getBoundingClientRect().top
      : 0;
  }
}
