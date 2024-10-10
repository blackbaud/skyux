import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  SkyMediaQueryService,
  SkyResizeObserverMediaQueryService,
  provideSkyMediaQueryServiceOverride,
} from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkySplitViewService } from './split-view.service';

/**
 * Contains the content, footer, and header to display in the split view's workspace panel.
 */
@Component({
  selector: 'sky-split-view-workspace',
  templateUrl: 'split-view-workspace.component.html',
  styleUrls: ['./split-view-workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideSkyMediaQueryServiceOverride(SkyResizeObserverMediaQueryService),
  ],
})
export class SkySplitViewWorkspaceComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  public set isMobile(value: boolean | undefined) {
    this.#_isMobile = value;
    this.#changeDetectorRef.markForCheck();
  }

  // Shows/hides the workspace header when the parent split view is in mobile responsive mode.
  public get isMobile(): boolean | undefined {
    return this.#_isMobile;
  }

  /**
   * The ARIA label for the workspace panel. This sets the panel's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  public showDrawerButtonClick = new EventEmitter<number>();

  #ngUnsubscribe = new Subject<void>();
  #changeDetectorRef: ChangeDetectorRef;
  #elementRef: ElementRef;
  #mediaQuerySvc: SkyResizeObserverMediaQueryService;
  #splitViewSvc: SkySplitViewService;

  #_isMobile: boolean | undefined;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    mediaQuerySvc: SkyMediaQueryService,
    splitViewSvc: SkySplitViewService,
  ) {
    this.#changeDetectorRef = changeDetectorRef;
    this.#elementRef = elementRef;
    this.#splitViewSvc = splitViewSvc;

    // Inject the media query service, but assert the type as the override
    // to avoid a circular reference by DI.
    this.#mediaQuerySvc =
      mediaQuerySvc as unknown as SkyResizeObserverMediaQueryService;
  }

  public ngOnInit(): void {
    this.#splitViewSvc.isMobileStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.#changeDetectorRef.markForCheck();
      });
  }

  public ngAfterViewInit(): void {
    this.#mediaQuerySvc.observe(this.#elementRef, {
      updateResponsiveClasses: true,
    });
  }

  public ngOnDestroy(): void {
    this.showDrawerButtonClick.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#mediaQuerySvc.unobserve();
  }
}
