import { AnimationEvent } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { skyAnimationSlide } from '@skyux/animations';
import {
  SkyAppWindowRef,
  SkyMediaBreakpoints,
  SkyMediaQueryService,
  SkyMutationObserverService,
} from '@skyux/core';
import { SkyChevronModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { Subject, Subscription, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyActionBarsResourcesModule } from '../shared/sky-action-bars-resources.module';

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
  animations: [skyAnimationSlide],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SkyActionBarsResourcesModule,
    SkyChevronModule,
    SkyThemeModule,
  ],
  providers: [SkySummaryActionBarAdapterService],
  selector: 'sky-summary-action-bar',
  standalone: true,
  styleUrls: ['./summary-action-bar.component.scss'],
  templateUrl: './summary-action-bar.component.html',
})
export class SkySummaryActionBarComponent implements AfterViewInit, OnDestroy {
  readonly #adapterService = inject(SkySummaryActionBarAdapterService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #elementRef = inject(ElementRef);
  readonly #mediaQuerySvc = inject(SkyMediaQueryService);
  readonly #observerService = inject(SkyMutationObserverService);
  readonly #windowRef = inject(SkyAppWindowRef);

  public isSummaryCollapsed = false;

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

  protected readonly isCollapsible = computed(() => {
    return (
      this.type() === SkySummaryActionBarType.StandardModal ||
      this.#breakpoint() === 'xs'
    );
  });

  protected readonly type = signal<SkySummaryActionBarType | undefined>(
    undefined,
  );

  #mediaQuerySubscription: Subscription | undefined;
  #observer: MutationObserver | undefined;
  #idled = new Subject<boolean>();

  readonly #breakpoint = toSignal(this.#mediaQuerySvc.breakpointChange);

  #_summaryElement: ElementRef | undefined;

  public ngAfterViewInit(): void {
    const type = this.#adapterService.getSummaryActionBarType(
      this.#elementRef.nativeElement,
    );

    if (
      !(
        type === SkySummaryActionBarType.FullPageModal ||
        type === SkySummaryActionBarType.StandardModal
      )
    ) {
      this.#setupReactiveState();

      if (type === SkySummaryActionBarType.SplitView) {
        this.#adapterService.styleSplitViewElementForActionBar(
          this.#elementRef,
        );
      } else {
        this.#adapterService.styleBodyElementForActionBar(this.#elementRef);
      }

      this.#setupResizeListener();

      if (type === SkySummaryActionBarType.Tab) {
        this.setupTabListener();
      }
    } else {
      this.#adapterService.styleModalFooter(this.#elementRef);

      if (type === SkySummaryActionBarType.FullPageModal) {
        this.#setupReactiveState();
      }
    }

    this.type.set(type);
    this.#changeDetector.detectChanges();
  }

  public ngOnDestroy(): void {
    const type = this.type();

    if (type === SkySummaryActionBarType.SplitView) {
      this.#adapterService.revertSplitViewElementStyles();
    } else if (
      type === SkySummaryActionBarType.Page ||
      type === SkySummaryActionBarType.Tab
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
    this.#changeDetector.markForCheck();
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

      const type = this.type();

      if (
        type === SkySummaryActionBarType.Page ||
        type === SkySummaryActionBarType.Tab
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
    this.#mediaQuerySubscription = this.#mediaQuerySvc.subscribe(
      (args: SkyMediaBreakpoints) => {
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
    if (this.type() !== SkySummaryActionBarType.SplitView) {
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
