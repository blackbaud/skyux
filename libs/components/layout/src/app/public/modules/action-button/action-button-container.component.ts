import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';

import {
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
  SkyActionButtonAdapterService
} from './action-button-adapter-service';

import {
  SkyActionButtonContainerAlignItems
} from './types/action-button-container-align-items';

/**
 * Wraps action buttons to ensures that they have consistent height and spacing.
 * @required
 */
@Component({
  selector: 'sky-action-button-container',
  styleUrls: ['./action-button-container.component.scss'],
  templateUrl: './action-button-container.component.html'
})
export class SkyActionButtonContainerComponent implements OnInit {

  /**
   * Specifies how to display the action buttons inside the action button container.
   * @default SkyActionButtonContainerAlignItems.center
   */
  @Input()
  public set alignItems(value: SkyActionButtonContainerAlignItems) {
    this._alignItems = value;
  }

  public get alignItems(): SkyActionButtonContainerAlignItems {
    return this._alignItems || SkyActionButtonContainerAlignItems.Center;
  }

  @ViewChild('container', {
    read: ElementRef,
    static: true
  })
  private containerRef: ElementRef<any>;

  private ngUnsubscribe = new Subject();

  private set themeName(value: string) {
    this._themeName = value;
    this.updateResponsiveClass();
    this.coreAdapterService.resetHeight(this.containerRef, '.sky-action-button');
    if (this._themeName === 'modern') {
      // Wait for children components to complete rendering before height is determined.
      setTimeout(() => {
        this.coreAdapterService.syncMaxHeight(this.containerRef, '.sky-action-button');
      });
    }
  }

  private _alignItems: SkyActionButtonContainerAlignItems;

  private _themeName: string;

  constructor(
    private actionButtonAdapterService: SkyActionButtonAdapterService,
    private changeRef: ChangeDetectorRef,
    private coreAdapterService: SkyCoreAdapterService,
    private themeSvc: SkyThemeService
  ) { }

  public ngOnInit(): void {
    if (this.themeSvc) {
      this.themeSvc.settingsChange
        .pipe(
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe((themeSettings) => {
          this.themeName = themeSettings.currentSettings?.theme?.name;
          this.changeRef.markForCheck();
        });
    }
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.updateResponsiveClass();
  }

  private updateResponsiveClass(): void {
    const parentWidth = this.actionButtonAdapterService.getParentWidth(this.containerRef);
    this.actionButtonAdapterService.setResponsiveClass(this.containerRef, parentWidth);
  }

}
