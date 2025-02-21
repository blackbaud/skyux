import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyScrollableHostService } from '@skyux/core';

import {
  BehaviorSubject,
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
  host: {
    class: 'sky-padding-even-xl',
  },
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
    @let linksValue = links();

    @if (linksValue && linksValue.length > 0) {
      <div class="sky-docs-showcase-panel-toc">
        <sky-table-of-contents
          [headingText]="tocHeadingText()"
          [links]="linksValue"
        />
      </div>
    }

    <div class="sky-docs-showcase-panel-body">
      <ng-content />
    </div>
  `,
})
export class SkyShowcasePanelComponent implements AfterViewInit, OnDestroy {
  readonly #anchors = toSignal(inject(SkyHeadingAnchorService).anchorsChange);
  readonly #scrollableHostSvc = inject(SkyScrollableHostService);
  readonly #elementRef = inject(ElementRef);

  public tocHeadingText = input.required<string>();

  protected links = computed<Link[] | undefined>(() => {
    const anchors = this.#anchors();
    const activeAnchorId = this.#activeAnchorIdOnScroll();

    return anchors?.map((a) => ({
      active: a.anchorId === activeAnchorId,
      anchorId: a.anchorId,
      title: a.title,
    }));
  });

  #loaded = new BehaviorSubject<boolean>(false);
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
          debounceTime(10),
          map(() => this.#getActiveLink()),
        );
      }),
      distinctUntilChanged(),
    ),
  );

  #getScrollOffset(scrollEl: HTMLElement | Window): number {
    const { top } = this.#elementRef.nativeElement.getBoundingClientRect();

    if (scrollEl instanceof HTMLElement) {
      return scrollEl.scrollTop + top;
    }

    return scrollEl.scrollY + top;
  }

  /**
   * A link is considered active if the page is scrolled past the anchor without
   * also being scrolled passed the next link.
   */
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
