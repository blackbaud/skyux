import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  SKY_STACKING_CONTEXT,
  SkyDynamicComponentService,
  SkyResponsiveHostDirective,
  SkyUIConfigService,
} from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import { take, takeUntil, takeWhile } from 'rxjs/operators';

import { SkyFlyoutResourcesModule } from '../shared/sky-flyout-resources.module';

import { SkyFlyoutAdapterService } from './flyout-adapter.service';
import { SkyFlyoutInstance } from './flyout-instance';
import { SkyFlyoutIteratorComponent } from './flyout-iterator.component';
import { SkyFlyoutAction } from './types/flyout-action';
import { SkyFlyoutBeforeCloseHandler } from './types/flyout-before-close-handler';
import { SkyFlyoutConfig } from './types/flyout-config';
import { SkyFlyoutConfigInternal } from './types/flyout-config-internal';
import { SkyFlyoutMessage } from './types/flyout-message';
import { SkyFlyoutMessageType } from './types/flyout-message-type';
import { SkyFlyoutPermalink } from './types/flyout-permalink';

let nextId = 0;

/**
 * @internal
 */
@Component({
  selector: 'sky-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.scss'],
  providers: [SkyFlyoutAdapterService],
  // Allow automatic change detection for child components.
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    A11yModule,
    CommonModule,
    RouterModule,
    SkyResponsiveHostDirective,
    SkyHrefModule,
    SkyIconModule,
    SkyFlyoutIteratorComponent,
    SkyFlyoutResourcesModule,
    SkyThemeModule,
  ],
})
export class SkyFlyoutComponent implements OnDestroy, OnInit {
  public config: SkyFlyoutConfigInternal = {
    defaultWidth: window.innerWidth / 2,
    minWidth: 320,
    maxWidth: window.innerWidth / 2,
    providers: [],
  };
  public enableTrapFocus = false;
  public enableTrapFocusAutoCapture = false;
  public flyoutId = `sky-flyout-${++nextId}`;
  public isOpen = false;
  public isOpening = false;

  public flyoutWidth = 0;
  public instanceReady = false;
  public isDragging = false;
  public isFullscreen = false;
  public resizeKeyControlActive = false;

  #xCoord = 0;
  #windowBufferSize = 20;

  public get messageStream(): Subject<SkyFlyoutMessage> {
    return this.#_messageStream;
  }

  public permalink: SkyFlyoutPermalink = {};

  public permalinkLabel = '';

  public primaryAction: SkyFlyoutAction = {};

  public primaryActionLabel = '';

  /**
   * @internal
   */
  public widthStep = 10;

  /**
   * @internal
   */
  @ViewChild('flyoutRef', {
    read: ElementRef,
    static: true,
  })
  public flyoutRef: ElementRef | undefined;

  @ViewChild('target', {
    read: ViewContainerRef,
    static: true,
  })
  public target: ViewContainerRef | undefined;

  @ViewChild('flyoutHeader', {
    read: ElementRef,
    static: true,
  })
  public flyoutHeader: ElementRef | undefined;

  protected zIndex$ = new BehaviorSubject(1001);

  #flyoutInstance: SkyFlyoutInstance<any> | undefined;

  #ngUnsubscribe = new Subject<void>();

  #_messageStream = new Subject<SkyFlyoutMessage>();

  readonly #adapter = inject(SkyFlyoutAdapterService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dynamicComponentSvc = inject(SkyDynamicComponentService);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #ngZone = inject(NgZone);
  readonly #resourcesService = inject(SkyLibResourcesService);
  readonly #uiConfigService = inject(SkyUIConfigService);

  constructor() {
    // All commands flow through the message stream.
    this.messageStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message: SkyFlyoutMessage) => {
        this.#handleIncomingMessages(message);
      });
  }

  public ngOnInit(): void {
    /* istanbul ignore else */
    if (this.flyoutHeader) {
      this.#adapter.adjustHeaderForHelp(this.flyoutHeader);
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: Event): void {
    this.#setFullscreen();

    if (this.isFullscreen) {
      return;
    }

    const target = event.target as Window;

    if (target.innerWidth - this.flyoutWidth < this.#windowBufferSize) {
      this.flyoutWidth = target.innerWidth - this.#windowBufferSize;
      this.#xCoord = this.#windowBufferSize;
      this.#setUserData();
    }
  }

  public attach<T>(
    component: Type<T>,
    config?: SkyFlyoutConfig,
    environmentInjector?: EnvironmentInjector,
  ): SkyFlyoutInstance<T> {
    this.#cleanTemplate();

    // Emit the closed event on any previously opened flyout instance
    if (this.#flyoutInstance) {
      this.#notifyClosed();
    }

    this.config = Object.assign(
      {
        defaultWidth: window.innerWidth / 2,
        minWidth: 320,
        maxWidth: window.innerWidth / 2,
        providers: [
          {
            provide: SKY_STACKING_CONTEXT,
            useValue: {
              zIndex: this.zIndex$
                .asObservable()
                .pipe(takeUntil(this.#ngUnsubscribe)),
            },
          },
        ],
      },
      config,
    );
    if (config?.defaultWidth && !config?.maxWidth) {
      this.config.maxWidth = config?.defaultWidth;
    }

    this.config.showIterator = this.config.showIterator || false;
    this.config.iteratorNextButtonDisabled =
      this.config.iteratorNextButtonDisabled || false;
    this.config.iteratorPreviousButtonDisabled =
      this.config.iteratorPreviousButtonDisabled || false;

    this.permalink = this.config.permalink ?? {};
    this.permalinkLabel =
      this.config.permalink && this.config.permalink.label
        ? this.config.permalink.label
        : this.#getString('skyux_flyout_permalink_button');

    this.primaryAction = this.config.primaryAction ?? {};
    this.primaryActionLabel =
      this.config.primaryAction && this.config.primaryAction.label
        ? this.config.primaryAction.label
        : this.#getString('skyux_flyout_primary_action_button');

    environmentInjector ||= this.#environmentInjector;
    const componentRef = this.#dynamicComponentSvc.createComponent(component, {
      environmentInjector: environmentInjector,
      providers: this.config.providers,
      viewContainerRef: this.target,
    });

    /* safety check */
    /* istanbul ignore if */
    if (!componentRef) {
      throw new Error("Flyout's internal component could not be created");
    }

    this.#flyoutInstance = this.#createFlyoutInstance<T>(componentRef.instance);

    // This is used to ensure we do not render the flyout until we have attached the component.
    // This allows the aria-labelledby to function correctly.
    this.instanceReady = true;
    this.#changeDetector.markForCheck();

    // Open the flyout immediately.
    this.messageStream.next({
      type: SkyFlyoutMessageType.Open,
    });

    if (this.config.settingsKey) {
      this.#uiConfigService
        .getConfig(this.config.settingsKey)
        .pipe(take(1))
        .subscribe((value: any) => {
          if (value && value.flyoutWidth) {
            this.flyoutWidth = value.flyoutWidth;
          } else {
            // Bad data, or config is the default config.
            this.flyoutWidth = this.config.defaultWidth;
          }
          this.#checkInitialSize();
        });
    } else {
      this.flyoutWidth = this.config.defaultWidth;
      this.#checkInitialSize();
    }

    return this.#flyoutInstance;
  }

  public close(): void {
    this.messageStream.next({
      type: SkyFlyoutMessageType.Close,
    });
  }

  public invokePrimaryAction(): boolean {
    if (this.primaryAction.callback) {
      this.primaryAction.callback();

      if (this.primaryAction.closeAfterInvoking) {
        this.close();
      }

      return false;
    }
    /* istanbul ignore next */
    return true;
  }

  public animationDone(event: TransitionEvent): void {
    if (
      event.propertyName !== 'transform' ||
      event.target !== this.flyoutRef?.nativeElement
    ) {
      return;
    }

    if (this.isOpening) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
      this.#notifyClosed();
      this.#cleanTemplate();
    }
  }

  public onHeaderGrabHandleMouseDown(event: MouseEvent): void {
    this.onResizeHandleMouseDown(event);
  }

  public onHeaderGrabHandleKeyDown(event: KeyboardEvent): void {
    this.#handleResizeKeyDown(event);
  }

  public onResizeHandleKeyDown(event: KeyboardEvent): void {
    this.#handleResizeKeyDown(event);
  }

  public onResizeHandleMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.isFullscreen) {
      return;
    }

    this.isDragging = true;
    this.#xCoord = event.clientX;

    this.#adapter.toggleIframePointerEvents(false);

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        takeWhile(() => {
          return this.isDragging;
        }),
      )
      .subscribe((moveEvent) => {
        this.onMouseMove(moveEvent);
      });

    fromEvent(document, 'mouseup')
      .pipe(
        takeWhile(() => {
          return this.isDragging;
        }),
      )
      .subscribe(() => {
        this.onHandleRelease();
      });
  }

  public onMouseMove(event: MouseEvent): void {
    /* Sanity check */
    /* istanbul ignore if */
    if (!this.isDragging) {
      return;
    }

    const offsetX = event.clientX - this.#xCoord;
    let width = this.flyoutWidth;

    width -= offsetX;

    if (width < this.config.minWidth || width > this.config.maxWidth) {
      return;
    }

    if (window.innerWidth - width < this.#windowBufferSize) {
      width = window.innerWidth - this.#windowBufferSize;
      this.#xCoord = this.#windowBufferSize;
    } else {
      this.#xCoord = event.clientX;
    }

    this.flyoutWidth = width;

    this.#changeDetector.markForCheck();
  }

  public onHandleRelease(): void {
    fromEvent(document, 'click')
      .pipe(take(1))
      .subscribe(() => {
        this.isDragging = false;
        this.#adapter.toggleIframePointerEvents(true);
        this.#setUserData();
      });
  }

  public onIteratorPreviousButtonClick(): void {
    /* istanbul ignore else */
    if (this.#flyoutInstance) {
      this.#flyoutInstance.iteratorPreviousButtonClick.emit();
    }
  }

  public onIteratorNextButtonClick(): void {
    /* istanbul ignore else */
    if (this.#flyoutInstance) {
      this.#flyoutInstance.iteratorNextButtonClick.emit();
    }
  }

  #createFlyoutInstance<T>(component: T): SkyFlyoutInstance<T> {
    const instance = new SkyFlyoutInstance<T>(component);

    instance.hostController
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((message: SkyFlyoutMessage) => {
        this.messageStream.next(message);
      });

    return instance;
  }

  #handleIncomingMessages(message: SkyFlyoutMessage): void {
    switch (message.type) {
      case SkyFlyoutMessageType.Open:
        if (!this.isOpen) {
          this.isOpen = false;
          this.isOpening = true;
        }
        this.#initFocusTrap();
        break;

      case SkyFlyoutMessageType.Close:
        if (
          (this.#flyoutInstance?.beforeClose as Subject<any>)?.observers
            .length === 0 ||
          message.data?.ignoreBeforeClose
        ) {
          this.isOpen = true;
          this.isOpening = false;
        } else {
          (this.#flyoutInstance?.beforeClose as Subject<any>)?.next(
            new SkyFlyoutBeforeCloseHandler(() => {
              this.isOpen = true;
              this.isOpening = false;
            }),
          );
        }
        break;

      case SkyFlyoutMessageType.EnableIteratorNextButton:
        this.config.iteratorNextButtonDisabled = false;
        break;

      case SkyFlyoutMessageType.EnableIteratorPreviousButton:
        this.config.iteratorPreviousButtonDisabled = false;
        break;

      case SkyFlyoutMessageType.DisableIteratorNextButton:
        this.config.iteratorNextButtonDisabled = true;
        break;

      case SkyFlyoutMessageType.DisableIteratorPreviousButton:
        this.config.iteratorPreviousButtonDisabled = true;
        break;
    }

    this.#changeDetector.markForCheck();
  }

  #notifyClosed(): void {
    this.#flyoutInstance?.closed.emit();
    this.#flyoutInstance?.closed.complete();
  }

  #cleanTemplate(): void {
    this.target?.clear();
  }

  #setFullscreen(): void {
    if (window.innerWidth - this.#windowBufferSize < this.config.minWidth) {
      this.isFullscreen = true;
    } else {
      this.isFullscreen = false;
    }
  }

  #setUserData(): void {
    if (this.config.settingsKey) {
      this.#uiConfigService
        .setConfig(this.config.settingsKey, {
          flyoutWidth: this.flyoutWidth,
        })
        .pipe(take(1))
        .subscribe(
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
          (err) => {
            console.warn('Could not save flyout data.');
            console.warn(err);
          },
        );
    }
  }

  #checkInitialSize(): void {
    if (this.flyoutWidth < this.config.minWidth) {
      this.flyoutWidth = this.config.minWidth;
      this.#setUserData();
    } else if (this.flyoutWidth > this.config.maxWidth) {
      this.flyoutWidth = this.config.maxWidth;
      this.#setUserData();
    }

    // Ensure flyout does not load larger than the window and its buffer
    if (window.innerWidth - this.flyoutWidth < this.#windowBufferSize) {
      this.flyoutWidth = window.innerWidth - this.#windowBufferSize;
      this.#xCoord = this.#windowBufferSize;
      this.#setUserData();
    }

    this.#setFullscreen();
  }

  #getString(key: string): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.#resourcesService.getStringForLocale({ locale: 'en-US' }, key);
  }

  #handleResizeKeyDown(event: KeyboardEvent): void {
    /* istanbul ignore else */
    if (event.key) {
      const keyPressed = event.key.toLowerCase().replace('arrow', '');
      switch (keyPressed) {
        case 'enter':
        case ' ':
          this.resizeKeyControlActive = !this.resizeKeyControlActive;
          break;
        case 'tab':
          /* istanbul ignore else */
          if (this.resizeKeyControlActive) {
            this.resizeKeyControlActive = false;
          }
          break;
        case 'left':
          if (this.resizeKeyControlActive) {
            /* istanbul ignore else */
            if (this.flyoutWidth < this.config.maxWidth) {
              this.flyoutWidth = Math.min(
                this.flyoutWidth + this.widthStep,
                this.config.maxWidth,
              );
            }
          }
          break;

        case 'right':
          if (this.resizeKeyControlActive) {
            /* istanbul ignore else */
            if (this.flyoutWidth > this.config.minWidth) {
              this.flyoutWidth = Math.max(
                this.flyoutWidth - this.widthStep,
                this.config.minWidth,
              );
            }
          }
          break;

        /* istanbul ignore next */
        default:
          break;
      }
    }
  }

  /** Executes a function when the zone is stable. */
  #executeOnStable(fn: () => any): void {
    if (this.#ngZone.isStable) {
      fn();
    } else {
      this.#ngZone.onStable.pipe(take(1)).subscribe(fn);
    }
  }

  #initFocusTrap(): void {
    this.enableTrapFocusAutoCapture = false;
    this.enableTrapFocus = false;
    // Waiting for zone to be stable will avoid ExpressionChangeAfterCheckedError.
    this.#executeOnStable(() => {
      this.enableTrapFocusAutoCapture = true;
      this.enableTrapFocus = true;
    });
  }
}
