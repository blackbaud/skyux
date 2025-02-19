import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  switchMap,
} from 'rxjs';

import { SkyHeadingAnchorService } from '../heading-anchor/heading-anchor.service';
import { SkyTableOfContentsComponent } from '../table-of-contents/table-of-contents.component';

interface Link {
  active: boolean;
  anchorId: string;
  title: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyTableOfContentsComponent],
  providers: [SkyHeadingAnchorService],
  selector: 'sky-showcase-panel',
  styles: `
    :host {
      display: flex;
      overflow: visible;
      align-items: flex-start;
      flex-direction: row-reverse;
      position: relative;
    }

    .sky-docs-showcase-panel-body {
      width: 75%;
      padding-right: 25px;
    }

    .sky-docs-showcase-panel-toc {
      padding-top: 25px;
      position: sticky;
      top: 0;
      width: 25%;
    }
  `,
  template: `
    @if (links(); as links) {
      <div class="sky-docs-showcase-panel-toc">
        <sky-table-of-contents [headingText]="headingText()" [links]="links" />
      </div>
    }

    <div class="sky-docs-showcase-panel-body">
      <ng-content />
    </div>
  `,
})
export class SkyShowcasePanelComponent {
  readonly #anchors = toSignal(inject(SkyHeadingAnchorService).anchorsChange);
  readonly #elementRef = inject(ElementRef);

  protected links = computed<Link[] | undefined>(() => {
    const anchors = this.#anchors();
    const activeAnchorId = this.#activeAnchorIdOnScroll();

    return anchors?.map((a) => ({
      active: a.anchorId === activeAnchorId,
      anchorId: a.anchorId,
      title: a.title,
    }));
  });

  #scrollEl: HTMLElement | Window = window;

  public headingText = input.required<string>();
  public scrollContainerSelector = input<string | undefined>(undefined);

  #activeAnchorIdOnScroll = toSignal(
    toObservable(this.scrollContainerSelector).pipe(
      switchMap((scrollContainerSelector) => {
        this.#scrollEl = this.#getScrollEl(scrollContainerSelector);

        return fromEvent(this.#scrollEl, 'scroll').pipe(
          debounceTime(10),
          map(() => this.#getActiveLink()),
        );
      }),
      distinctUntilChanged(),
    ),
  );

  #getScrollEl(selector?: string): HTMLElement | Window {
    let scrollEl: HTMLElement | Window = window;

    if (selector) {
      const el = document.querySelector<HTMLElement>(selector);

      if (el) {
        scrollEl = el;
      }
    }

    return scrollEl;
  }

  #getScrollOffset(scrollEl: HTMLElement | Window): number {
    const { top } = this.#elementRef.nativeElement.getBoundingClientRect();

    if (scrollEl instanceof HTMLElement) {
      return scrollEl.scrollTop + top;
    }

    return scrollEl.scrollY + top;
  }

  #getActiveLink(): string | undefined {
    const anchors = this.#anchors();

    if (anchors) {
      const scrollOffset = this.#getScrollOffset(this.#scrollEl);

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
          rect?.top !== undefined &&
          rect.top < scrollOffset &&
          (nextRect?.top === undefined || nextRect?.top > scrollOffset)
        ) {
          return anchor.anchorId;
        }
      }

      return anchors[0].anchorId;
    }

    return undefined;
  }
}
