import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  SkyCoreAdapterService,
  SkyMediaBreakpoints
} from '@skyux/core';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  takeUntil
} from 'rxjs/operators';

import {
  Subject
} from 'rxjs';

import {
  SkySelectionBoxComponent
} from './selection-box.component';

import {
  SkySelectionBoxAdapterService
} from './selection-box-adapter.service';

import {
  SkySelectionBoxGridAlignItems
} from './types/selection-box-grid-align-items';

const SKY_SELECTION_BOX_CLASS_NAME = '.sky-selection-box';

/**
 * Creates a grid layout for an array of selection boxes.
 */
@Component({
  selector: 'sky-selection-box-grid',
  templateUrl: './selection-box-grid.component.html',
  styleUrls: [
    './selection-box-grid.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SkySelectionBoxGridComponent implements AfterViewInit, OnDestroy, OnInit {

  /**
   * Specifies how to display the selection boxes inside the selection box grid.
   * @default SkySelectionBoxGridAlignItems.Center
   */
  @Input()
  public set alignItems(value: SkySelectionBoxGridAlignItems) {
    this._alignItems = value;
  }

  public get alignItems(): SkySelectionBoxGridAlignItems {
    return this._alignItems || SkySelectionBoxGridAlignItems.Center;
  }

  @ContentChildren(SkySelectionBoxComponent, {
    read: SkySelectionBoxComponent
  })
  public selectionBoxes: QueryList<SkySelectionBoxComponent>;

  private set currentBreakpoint(value: SkyMediaBreakpoints) {
    if (value !== this._currentBreakpoint) {
      this._currentBreakpoint = value;
      this.selectionBoxAdapter.setResponsiveClass(this.elementRef, value);
      this.updateChildrenHeights();
    }
  }

  @ViewChild('container', {
    read: ElementRef,
    static: true
  })
  private elementRef: ElementRef<any>;

  private ngUnsubscribe = new Subject();

  private _alignItems: SkySelectionBoxGridAlignItems;

  private _currentBreakpoint: SkyMediaBreakpoints;

  constructor(
    private themeSvc: SkyThemeService,
    private coreAdapterService: SkyCoreAdapterService,
    private selectionBoxAdapter: SkySelectionBoxAdapterService
  ) {}

  public ngOnInit(): void {
    if (this.themeSvc) {
      this.themeSvc.settingsChange
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(() => {
          this.updateBreakpointClass();
          this.updateChildrenHeights();
        });
    }
  }

  public ngAfterViewInit(): void {
    this.updateBreakpointClass();
    this.updateChildrenHeights();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.updateBreakpointClass();
  }

  private updateBreakpointClass(): void {
    const parentWidth = this.selectionBoxAdapter.getParentWidth(this.elementRef);
    this.currentBreakpoint = this.selectionBoxAdapter.getBreakpointForWidth(parentWidth);
  }

  private updateChildrenHeights(): void {
    this.coreAdapterService.resetHeight(this.elementRef, SKY_SELECTION_BOX_CLASS_NAME);
    this.coreAdapterService.syncMaxHeight(this.elementRef, SKY_SELECTION_BOX_CLASS_NAME);
  }

}
