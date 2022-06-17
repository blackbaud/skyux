import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SkyCoreAdapterService } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyActionButtonAdapterService } from './action-button-adapter-service';
import { SkyActionButtonComponent } from './action-button.component';
import { SkyActionButtonContainerAlignItemsType } from './types/action-button-container-align-items-type';

/**
 * Wraps action buttons to ensures that they have consistent height and spacing.
 * @required
 */
@Component({
  selector: 'sky-action-button-container',
  styleUrls: ['./action-button-container.component.scss'],
  templateUrl: './action-button-container.component.html',
  providers: [SkyActionButtonAdapterService],
  encapsulation: ViewEncapsulation.None,
})
export class SkyActionButtonContainerComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  /**
   * Specifies how to display the action buttons inside the action button container.
   * Options are `"center"` or `"left"`.
   * @default "center"
   */
  @Input()
  public set alignItems(value: SkyActionButtonContainerAlignItemsType) {
    this._alignItems = value;
  }

  public get alignItems(): SkyActionButtonContainerAlignItemsType {
    return this._alignItems || 'center';
  }

  @ContentChildren(SkyActionButtonComponent)
  private actionButtons: QueryList<SkyActionButtonComponent>;

  @ViewChild('container', {
    read: ElementRef,
    static: true,
  })
  private containerRef: ElementRef<any>;

  private ngUnsubscribe = new Subject<void>();

  private syncMaxHeightTimeout?: number;

  private set themeName(value: string) {
    this._themeName = value;
    this.updateResponsiveClass();
    this.updateHeight();
  }

  private _alignItems: SkyActionButtonContainerAlignItemsType;

  private _themeName: string;

  private _viewInitialized = false;

  constructor(
    private actionButtonAdapterService: SkyActionButtonAdapterService,
    private changeRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private hostElRef: ElementRef,
    @Optional() private themeSvc?: SkyThemeService
  ) {}

  public ngOnInit(): void {
    /* istanbul ignore else */
    if (this.themeSvc) {
      this.themeSvc.settingsChange
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((themeSettings) => {
          this.themeName = themeSettings.currentSettings.theme.name;
          this.changeRef.markForCheck();
        });
    }

    // Wait for children components to complete rendering before container width is determined.
    setTimeout(() => {
      this.updateResponsiveClass();
    });
  }

  public ngAfterViewInit(): void {
    // Watch for dynamic action button changes and recalculate height.
    /* istanbul ignore else */
    if (this.actionButtons) {
      this.actionButtons.changes
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.updateHeight();
        });
    }
    this._viewInitialized = true;
    this.updateHeight();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onContentChange() {
    this.updateHeight();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.updateResponsiveClass();
  }

  private updateHeight(): void {
    if (this._viewInitialized) {
      this.coreAdapterService.resetHeight(
        this.containerRef,
        '.sky-action-button'
      );
      if (this._themeName === 'modern') {
        // Wait for children components to complete rendering before height is determined.
        clearTimeout(this.syncMaxHeightTimeout);
        this.syncMaxHeightTimeout = setTimeout(() => {
          this.coreAdapterService.syncMaxHeight(
            this.containerRef,
            '.sky-action-button'
          );
        }) as unknown as number;
      }
    }
  }

  private updateResponsiveClass(): void {
    const parentWidth = this.actionButtonAdapterService.getParentWidth(
      this.hostElRef
    );
    this.actionButtonAdapterService.setResponsiveClass(
      this.containerRef,
      parentWidth
    );
  }
}
