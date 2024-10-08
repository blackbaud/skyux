import { AnimationEvent } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { skyAnimationSlide } from '@skyux/animations';
import {
  SkyAppWindowRef,
  SkyMediaBreakpoints,
  SkyMediaQueryService,
  SkyMutationObserverService,
} from '@skyux/core';

import { Subject, Subscription, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkySummaryActionBarAdapterService } from './summary-action-bar-adapter.service';
import { SkySummaryActionBarSummaryComponent } from './summary/summary-action-bar-summary.component';
import { SkySummaryActionBarType } from './types/summary-action-bar-type';

/**
 * Auto-incrementing integer used to generate unique ids for summary action bar components.
 */
let nextId = 0;

/**
 * Contains the `sky-summary-action-bar-actions` and
 * `sky-summary-action-bar-summary` components.
 */
@Component({
  selector: 'sky-summary-action-bar',
  templateUrl: './summary-action-bar.component.html',
  styleUrls: ['./summary-action-bar.component.scss'],
  animations: [skyAnimationSlide],
  providers: [SkySummaryActionBarAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySummaryActionBarComponent implements AfterViewInit, OnDestroy {
  public isSummaryCollapsed = false;

  public type: SkySummaryActionBarType | undefined;

  public slideDirection = 'down';

  public summaryId = `sky-summary-action-bar-summary-${++nextId}`;

  @ContentChild(SkySummaryActionBarSummaryComponent, { read: ElementRef })
  public set summaryElement(element: ElementRef | undefined) {
    this.#_summaryElement = element;
    this.#changeDetector.markForCheck();
  }

  public get summaryElement(): ElementRef | undefined {
    return this.#_summaryElement;
  }

  @ViewChild('chevronEl', { read: ElementRef })
  public chevronElementRef: ElementRef | undefined;

  #mediaQuerySubscription: Subscription | undefined;
  #observer: MutationObserver | undefined;
  #idled = new Subject<boolean>();
  #adapterService: SkySummaryActionBarAdapterService;
  #changeDetector: ChangeDetectorRef;
  #elementRef: ElementRef;
  #observerService: SkyMutationObserverService;
  #windowRef: SkyAppWindowRef;

  #_summaryElement: ElementRef | undefined;

  constructor(
    adapterService: SkySummaryActionBarAdapterService,
    changeDetector: ChangeDetectorRef,
    elementRef: ElementRef,
    public mediaQueryService: SkyMediaQueryService,
    observerService: SkyMutationObserverService,
    windowRef: SkyAppWindowRef,
  ) {
    this.#adapterService = adapterService;
    this.#changeDetector = changeDetector;
    this.#elementRef = elementRef;
    this.#observerService = observerService;
    this.#windowRef = windowRef;
  }

  public ngAfterViewInit(): void {
    this.type = this.#adapterService.getSummaryActionBarType(
      this.#elementRef.nativeElement,
    );

    if (
      !(
        this.type === SkySummaryActionBarType.FullPageModal ||
        this.type === SkySummaryActionBarType.StandardModal
      )
    ) {
      console.log('setupReactiveState 1');
      this.#setupReactiveState();

      if (this.type === SkySummaryActionBarType.SplitView) {
        this.#adapterService.styleSplitViewElementForActionBar(
          this.#elementRef,
        );
      } else {
        this.#adapterService.styleBodyElementForActionBar(this.#elementRef);
      }

      this.#setupResizeListener();

      if (this.type === SkySummaryActionBarType.Tab) {
        this.setupTabListener();
      }
    } else {
      this.#adapterService.styleModalFooter(this.#elementRef);

      if (this.type === SkySummaryActionBarType.FullPageModal) {
        console.log('setupReactiveState 2');
        this.#setupReactiveState();
      }
    }
    this.#changeDetector.detectChanges();
  }

  public ngOnDestroy(): void {
    if (this.type === SkySummaryActionBarType.SplitView) {
      this.#adapterService.revertSplitViewElementStyles();
    } else if (
      this.type === SkySummaryActionBarType.Page ||
      this.type === SkySummaryActionBarType.Tab
    ) {
      this.#adapterService.revertBodyElementStyles();
    }

    this.#removeResizeListener();
    this.#removeTabListener();

    if (this.#mediaQuerySubscription) {
      this.#mediaQuerySubscription.unsubscribe();
    }
    this.#idled.complete();
  }

  public onDirectionChange(direction: string): void {
    this.slideDirection = direction;
  }

  public summaryContentExists(): boolean {
    return !!(this.summaryElement?.nativeElement.children.length || 0 > 0);
  }

  // NOTE: This function is needed so that the button is not removed until post-animation
  public summaryTransitionEnd(animationEvent: AnimationEvent): void {
    if (
      animationEvent.toState !== 'void' &&
      animationEvent.fromState !== 'void'
    ) {
      if (this.slideDirection === 'up') {
        this.isSummaryCollapsed = true;
        this.#changeDetector.markForCheck();
      }

      if (
        this.type === SkySummaryActionBarType.Page ||
        this.type === SkySummaryActionBarType.Tab
      ) {
        this.#adapterService.styleBodyElementForActionBar(this.#elementRef);
      }

      // Ensure that the correct chevron is fully rendered prior to setting focus.
      setTimeout(() => {
        this.#adapterService.focusChevron(this.chevronElementRef);
      });
    }
  }

  // NOTE: This function is needed so that the button is added before animation
  public summaryTransitionStart(): void {
    if (this.slideDirection === 'down') {
      this.isSummaryCollapsed = false;
    }
  }

  #setupReactiveState(): void {
    console.log('setupReactiveState() current', this.mediaQueryService.current);
    this.#mediaQuerySubscription = this.mediaQueryService.subscribe(
      (args: SkyMediaBreakpoints) => {
        console.log('subscribe', args);
        if (args !== SkyMediaBreakpoints.xs) {
          this.isSummaryCollapsed = false;
          this.slideDirection = 'down';
        }
        this.#changeDetector.detectChanges();
      },
    );
  }

  public setupTabListener(): void {
    /* istanbul ignore else */
    if (!this.#observer) {
      this.#observer = this.#observerService.create(
        (mutations: MutationRecord[]) => {
          if (
            (mutations[0].target as HTMLElement).attributes.getNamedItem(
              'hidden',
            )
          ) {
            this.#adapterService.revertBodyElementStyles();
            this.#removeResizeListener();
          } else {
            setTimeout(() => {
              this.#adapterService.styleBodyElementForActionBar(
                this.#elementRef,
              );
              this.#setupResizeListener();
            });
          }
        },
      );
    }

    const config = {
      attributes: true,
      attributeFilter: ['hidden'],
      childList: false,
      characterDate: false,
    };
    let el = this.#elementRef.nativeElement;
    do {
      if (el.classList.contains('sky-tab')) {
        this.#observer.observe(el, config);
      }
      el = el.parentElement;
    } while (el !== null && el.nodeType === 1);
  }

  #removeTabListener(): void {
    if (this.#observer) {
      this.#observer.disconnect();
    }
  }

  #setupResizeListener(): void {
    if (this.type !== SkySummaryActionBarType.SplitView) {
      const windowObj = this.#windowRef.nativeWindow;
      fromEvent(windowObj, 'resize')
        .pipe(takeUntil(this.#idled))
        .subscribe(() => {
          this.#adapterService.styleBodyElementForActionBar(this.#elementRef);
        });
    }
  }

  #removeResizeListener(): void {
    this.#idled.next(true);
  }
}
