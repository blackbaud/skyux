import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  SkyContentQueryLegacyService,
  SkyCoreAdapterService,
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
    SkyContentQueryLegacyService,
    provideSkyMediaQueryServiceOverride(SkyContentQueryLegacyService),
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
  #coreAdapterSvc: SkyCoreAdapterService;
  #elementRef: ElementRef;
  #mediaQuerySvc: SkyContentQueryLegacyService;
  #splitViewSvc: SkySplitViewService;

  #_isMobile: boolean | undefined;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    coreAdapterSvc: SkyCoreAdapterService,
    elementRef: ElementRef,
    mediaQuerySvc: SkyContentQueryLegacyService,
    splitViewSvc: SkySplitViewService,
  ) {
    this.#changeDetectorRef = changeDetectorRef;
    this.#coreAdapterSvc = coreAdapterSvc;
    this.#elementRef = elementRef;
    this.#mediaQuerySvc = mediaQuerySvc;
    this.#splitViewSvc = splitViewSvc;
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
    this.#splitViewSvc.drawerWidthStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#updateBreakpoint();
      });
  }

  public ngOnDestroy(): void {
    this.showDrawerButtonClick.complete();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.#updateBreakpoint();
  }

  #updateBreakpoint(): void {
    const width = this.#elementRef.nativeElement.parentElement.clientWidth;
    this.#mediaQuerySvc.setBreakpointForWidth(width);
    const newDrawerBreakpoint = this.#mediaQuerySvc.current;
    this.#coreAdapterSvc.setResponsiveContainerClass(
      this.#elementRef,
      newDrawerBreakpoint,
    );
    this.#changeDetectorRef.markForCheck();
  }
}
