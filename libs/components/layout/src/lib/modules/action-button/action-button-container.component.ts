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
import { SkyThemeComponentClassDirective, SkyThemeService } from '@skyux/theme';

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
  styleUrls: [
    './action-button-container.default.component.scss',
    './action-button-container.modern.component.scss',
  ],
  templateUrl: './action-button-container.component.html',
  providers: [SkyActionButtonAdapterService],
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [SkyThemeComponentClassDirective],
  standalone: false,
})
export class SkyActionButtonContainerComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  /**
   * How to display the action buttons inside the action button container.
   * Options are `"center"` or `"left"`.
   * @default "center"
   */
  @Input()
  public set alignItems(
    value: SkyActionButtonContainerAlignItemsType | undefined,
  ) {
    this.#_alignItems = value ?? 'center';
  }

  public get alignItems(): SkyActionButtonContainerAlignItemsType {
    return this.#_alignItems;
  }

  @ContentChildren(SkyActionButtonComponent)
  public actionButtons: QueryList<SkyActionButtonComponent> | undefined;

  @ViewChild('container', {
    read: ElementRef,
    static: true,
  })
  public containerRef: ElementRef | undefined;

  #ngUnsubscribe = new Subject<void>();

  #syncMaxHeightTimeout?: number;

  set #themeName(value: string) {
    this.#_themeName = value;
    this.#updateResponsiveClass();
    this.#updateHeight();
  }

  #_alignItems: SkyActionButtonContainerAlignItemsType = 'center';

  #_themeName: string | undefined;

  #viewInitialized = false;

  #actionButtonAdapterService: SkyActionButtonAdapterService;
  #changeDetector: ChangeDetectorRef;
  #coreAdapterService: SkyCoreAdapterService;
  #hostElRef: ElementRef;
  #themeSvc: SkyThemeService | undefined;

  constructor(
    actionButtonAdapterService: SkyActionButtonAdapterService,
    changeDetector: ChangeDetectorRef,
    coreAdapterService: SkyCoreAdapterService,
    hostElRef: ElementRef,
    @Optional() themeSvc?: SkyThemeService,
  ) {
    this.#actionButtonAdapterService = actionButtonAdapterService;
    this.#changeDetector = changeDetector;
    this.#coreAdapterService = coreAdapterService;
    this.#hostElRef = hostElRef;
    this.#themeSvc = themeSvc;
  }

  public ngOnInit(): void {
    /* istanbul ignore else */
    if (this.#themeSvc) {
      this.#themeSvc.settingsChange
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((themeSettings) => {
          this.#themeName = themeSettings.currentSettings.theme.name;
          this.#changeDetector.markForCheck();
        });
    }

    // Wait for children components to complete rendering before container width is determined.
    setTimeout(() => {
      this.#updateResponsiveClass();
    });
  }

  public ngAfterViewInit(): void {
    // Watch for dynamic action button changes and recalculate height.
    /* istanbul ignore else */
    if (this.actionButtons) {
      this.actionButtons.changes
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe(() => {
          this.#updateHeight();
        });
    }
    this.#viewInitialized = true;
    this.#updateHeight();
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public onContentChange(): void {
    this.#updateHeight();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    this.#updateResponsiveClass();
  }

  #updateHeight(delay = 0): void {
    const ref = this.containerRef;
    if (ref && this.#viewInitialized) {
      this.#coreAdapterService.resetHeight(ref, '.sky-action-button');
      if (this.#_themeName === 'modern') {
        // Wait for children components to complete rendering before height is determined.
        clearTimeout(this.#syncMaxHeightTimeout);
        this.#syncMaxHeightTimeout = setTimeout(() => {
          const selector = '.sky-action-button:not([hidden])';
          const button = ref.nativeElement.querySelector(selector);
          if (button && button.offsetHeight > 0) {
            this.#coreAdapterService.syncMaxHeight(ref, selector);
          } else if (delay < 200) {
            // Wait progressively longer between retries.
            this.#updateHeight(delay + 50);
          }
        }, delay) as unknown as number;
      }
    }
  }

  #updateResponsiveClass(): void {
    if (this.containerRef) {
      const parentWidth = this.#actionButtonAdapterService.getParentWidth(
        this.#hostElRef,
      );
      this.#actionButtonAdapterService.setResponsiveClass(
        this.containerRef,
        parentWidth,
      );
    }
  }
}
