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
import { SkyCoreAdapterService, SkyMediaQueryService } from '@skyux/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkySplitViewMediaQueryService } from './split-view-media-query.service';
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
    {
      provide: SkyMediaQueryService,
      useExisting: SkySplitViewMediaQueryService,
    },
  ],
})
export class SkySplitViewWorkspaceComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  public set isMobile(value: boolean) {
    this._isMobile = value;
    this.changeDetectorRef.markForCheck();
  }

  // Shows/hides the workspace header when the parent split view is in mobile responsive mode.
  public get isMobile(): boolean {
    return this._isMobile || false;
  }

  /**
   * Specifies an ARIA label for the workspace panel. This sets the panel's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   */
  @Input()
  public ariaLabel: string;

  public showDrawerButtonClick = new EventEmitter<number>();

  private ngUnsubscribe = new Subject<void>();

  private _isMobile: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private elementRef: ElementRef,
    private splitViewMediaQueryService: SkySplitViewMediaQueryService,
    private splitViewService: SkySplitViewService
  ) {}

  public ngOnInit(): void {
    this.splitViewService.isMobileStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((mobile: boolean) => {
        this.isMobile = mobile;
        this.changeDetectorRef.markForCheck();
      });
  }

  public ngAfterViewInit(): void {
    this.splitViewService.drawerWidthStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.updateBreakpoint();
      });
  }

  public ngOnDestroy(): void {
    this.showDrawerButtonClick.complete();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.updateBreakpoint();
  }

  private updateBreakpoint(): void {
    const width = this.elementRef.nativeElement.parentElement.clientWidth;
    this.splitViewMediaQueryService.setBreakpointForWidth(width);
    const newDrawerBreakpoint = this.splitViewMediaQueryService.current;
    this.coreAdapterService.setResponsiveContainerClass(
      this.elementRef,
      newDrawerBreakpoint
    );
    this.changeDetectorRef.markForCheck();
  }
}
