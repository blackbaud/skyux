import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {
  MutationObserverService,
  SkyCoreAdapterService
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
  SkyActionButtonContainerAlignItemsType
} from './types/action-button-container-align-items-type';

import {
  SkyActionButtonAdapterService
} from './action-button-adapter-service';

import {
  SkyActionButtonComponent
} from './action-button.component';

/**
 * Wraps action buttons to ensures that they have consistent height and spacing.
 * @required
 */
@Component({
  selector: 'sky-action-button-container',
  styleUrls: ['./action-button-container.component.scss'],
  templateUrl: './action-button-container.component.html',
  providers: [
    SkyActionButtonAdapterService
  ],
  encapsulation: ViewEncapsulation.None
})
export class SkyActionButtonContainerComponent implements AfterContentInit, OnDestroy, OnInit {

  /**
   * Specifies how to display the action buttons inside the action button container.
   * @default 'center'
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
    static: true
  })
  private containerRef: ElementRef<any>;

  private mutationObserver: MutationObserver;

  private ngUnsubscribe = new Subject();

  private set themeName(value: string) {
    this._themeName = value;
    this.updateResponsiveClass();
    this.updateHeight();
  }

  private _alignItems: SkyActionButtonContainerAlignItemsType;

  private _themeName: string;

  constructor(
    private actionButtonAdapterService: SkyActionButtonAdapterService,
    private changeRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private hostElRef: ElementRef,
    private mutationObserverSvc: MutationObserverService,
    private ngZone: NgZone,
    @Optional() private themeSvc?: SkyThemeService
  ) { }

  public ngOnInit(): void {
    /* istanbul ignore else */
    if (this.themeSvc) {
      this.themeSvc.settingsChange
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
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

  public ngAfterContentInit(): void {
    // Watch for dynamic action button changes and recalculate height.
    /* istanbul ignore else */
    if (this.actionButtons) {
      this.actionButtons.changes
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(() => {
          this.updateHeight();
        });
    }

    this.initMutationObserver();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.destroyMutationObserver();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.updateResponsiveClass();
  }

  private initMutationObserver(): void {
    /* istanbul ignore else */
    if (!this.mutationObserver) {
      const el = this.containerRef.nativeElement;

      // MutationObserver is patched by Zone.js and therefore becomes part of the
      // Angular change detection cycle, but this can lead to infinite loops in some
      // scenarios. This will keep MutationObserver from triggering change detection.
      this.ngZone.runOutsideAngular(() => {
        this.mutationObserver = this.mutationObserverSvc.create(() => {
          this.updateHeight();
        });

        this.mutationObserver.observe(
          el,
          {
            characterData: true,
            subtree: true
          }
        );
      });
    }
  }

  private destroyMutationObserver(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
  }

  private updateHeight(): void {
    this.coreAdapterService.resetHeight(this.containerRef, '.sky-action-button');
    if (this._themeName === 'modern') {
      // Wait for children components to complete rendering before height is determined.
      setTimeout(() => {
        this.coreAdapterService.syncMaxHeight(this.containerRef, '.sky-action-button');
      });
    }
  }

  private updateResponsiveClass(): void {
    const parentWidth = this.actionButtonAdapterService.getParentWidth(this.hostElRef);
    this.actionButtonAdapterService.setResponsiveClass(this.containerRef, parentWidth);
  }

}
