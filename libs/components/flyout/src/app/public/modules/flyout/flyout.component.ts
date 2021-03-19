import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  OnInit,
  ReflectiveInjector,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  fromEvent,
  Subject
} from 'rxjs';

import {
  take,
  takeUntil,
  takeWhile
} from 'rxjs/operators';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService,
  SkyUIConfigService
} from '@skyux/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyFlyoutAdapterService
} from './flyout-adapter.service';

import {
  SkyFlyoutInstance
} from './flyout-instance';

import {
  SkyFlyoutMediaQueryService
} from './flyout-media-query.service';

import {
  SkyFlyoutAction
} from './types/flyout-action';

import {
  SkyFlyoutConfig
} from './types/flyout-config';

import {
  SkyFlyoutMessage
} from './types/flyout-message';

import {
  SkyFlyoutMessageType
} from './types/flyout-message-type';

import {
  SkyFlyoutPermalink
} from './types/flyout-permalink';

const FLYOUT_OPEN_STATE = 'flyoutOpen';
const FLYOUT_CLOSED_STATE = 'flyoutClosed';

let nextId = 0;

/**
 * @internal
 */
@Component({
  selector: 'sky-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.scss'],
  providers: [
    SkyFlyoutMediaQueryService,
    { provide: SkyMediaQueryService, useExisting: SkyFlyoutMediaQueryService }
  ],
  animations: [
    trigger('flyoutState', [
      state(FLYOUT_OPEN_STATE, style({ transform: 'initial' })),
      state(FLYOUT_CLOSED_STATE, style({ transform: 'translateX(100%)' })),
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate(250)
      ]),
      transition(`* <=> *`, animate('250ms ease-in'))
    ])
  ],
  // Allow automatic change detection for child components.
  changeDetection: ChangeDetectionStrategy.Default
})
export class SkyFlyoutComponent implements OnDestroy, OnInit {
  public config: SkyFlyoutConfig;
  public flyoutId: string = `sky-flyout-${++nextId}`;
  public flyoutState = FLYOUT_CLOSED_STATE;
  public isOpen = false;
  public isOpening = false;

  public flyoutWidth = 0;
  public isDragging = false;
  public isFullscreen = false;

  private xCoord = 0;
  private windowBufferSize = 20;

  public get messageStream(): Subject<SkyFlyoutMessage> {
    return this._messageStream;
  }

  public get permalink(): SkyFlyoutPermalink {
    const permalink = this.config.permalink;
    if (permalink) {
      return permalink;
    }

    return {};
  }

  public get permalinkLabel(): string {
    if (this.permalink.label) {
      return this.permalink.label;
    }

    return this.getString('skyux_flyout_permalink_button');
  }

  public get primaryAction(): SkyFlyoutAction {
    let primaryAction = this.config.primaryAction;
    if (primaryAction) {
      return primaryAction;
    }

    return {};
  }

  public get primaryActionLabel(): string {
    if (this.config.primaryAction && this.config.primaryAction.label) {
      return this.config.primaryAction.label;
    }

    return this.getString('skyux_flyout_primary_action_button');
  }

  public themeName: string;

  /**
   * @internal
   */
  public widthStep: number = 10;

  /**
   * @internal
   */
  @ViewChild('flyoutRef', {
    read: ElementRef,
    static: true
  })
  public flyoutRef: ElementRef;

  @ViewChild('target', {
    read: ViewContainerRef,
    static: true
  })
  private target: ViewContainerRef;

  @ViewChild('flyoutHeader', {
    read: ElementRef,
    static: true
  })
  private flyoutHeader: ElementRef;

  private flyoutInstance: SkyFlyoutInstance<any>;

  private ngUnsubscribe = new Subject();

  private _messageStream = new Subject<SkyFlyoutMessage>();

  constructor(
    private adapter: SkyFlyoutAdapterService,
    private changeDetector: ChangeDetectorRef,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private resourcesService: SkyLibResourcesService,
    private flyoutMediaQueryService: SkyFlyoutMediaQueryService,
    private elementRef: ElementRef,
    private uiConfigService: SkyUIConfigService
  ) {
    // All commands flow through the message stream.
    this.messageStream
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: SkyFlyoutMessage) => {
        this.handleIncomingMessages(message);
      });
  }

  public ngOnInit(): void {
    this.adapter.adjustHeaderForHelp(this.flyoutHeader);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: any): void {
    if (this.flyoutMediaQueryService.isWidthWithinBreakpiont(event.target.innerWidth,
      SkyMediaBreakpoints.xs)) {
      this.updateBreakpointAndResponsiveClass(event.target.innerWidth);
    } else {
      this.updateBreakpointAndResponsiveClass(this.flyoutWidth);
    }

    this.setFullscreen();

    if (event.target.innerWidth - this.flyoutWidth < this.windowBufferSize) {
      this.flyoutWidth = event.target.innerWidth - this.windowBufferSize;
      this.xCoord = this.windowBufferSize;
      this.setUserData();
    }
  }

  public attach<T>(component: Type<T>, config: SkyFlyoutConfig): SkyFlyoutInstance<T> {
    this.cleanTemplate();

    // Emit the closed event on any previously opened flyout instance
    if (this.flyoutInstance) {
      this.notifyClosed();
    }

    this.config = Object.assign({ providers: [] }, config);
    this.config.defaultWidth = this.config.defaultWidth || (window.innerWidth / 2);
    this.config.minWidth = this.config.minWidth || 320;
    this.config.maxWidth = this.config.maxWidth || this.config.defaultWidth;

    this.config.showIterator = this.config.showIterator || false;
    this.config.iteratorNextButtonDisabled = this.config.iteratorNextButtonDisabled || false;
    this.config.iteratorPreviousButtonDisabled = this.config.iteratorPreviousButtonDisabled || false;

    const factory = this.resolver.resolveComponentFactory(component);

    /* tslint:disable:deprecation */
    /**
     * NOTE: We need to update this to use the new Injector.create(options) method
     * after Angular 4 support is dropped.
     */
    const providers = ReflectiveInjector.resolve(this.config.providers);
    const injector = ReflectiveInjector.fromResolvedProviders(providers, this.injector);
    /* tslint:enable:deprecation */

    const componentRef = this.target.createComponent(factory, undefined, injector);

    this.flyoutInstance = this.createFlyoutInstance<T>(componentRef.instance);

    // Open the flyout immediately.
    this.messageStream.next({
      type: SkyFlyoutMessageType.Open
    });

    if (this.config.settingsKey) {
      this.uiConfigService.getConfig(this.config.settingsKey)
        .pipe(take(1))
        .subscribe((value: any) => {
          if (value && value.flyoutWidth) {
            this.flyoutWidth = value.flyoutWidth;
          } else {
            // Bad data, or config is the default config.
            this.flyoutWidth = this.config.defaultWidth;
          }
          this.checkInitialSize();
        });
    } else {
      this.flyoutWidth = this.config.defaultWidth;
      this.checkInitialSize();
    }

    return this.flyoutInstance;
  }

  public close(): void {
    this.messageStream.next({
      type: SkyFlyoutMessageType.Close
    });
  }

  public invokePrimaryAction(): boolean {
    this.primaryAction.callback();

    if (this.primaryAction.closeAfterInvoking) {
      this.close();
    }

    return false;
  }

  public getAnimationState(): string {
    return (this.isOpening) ? FLYOUT_OPEN_STATE : FLYOUT_CLOSED_STATE;
  }

  public animationDone(event: AnimationEvent): void {
    if (event.toState === FLYOUT_OPEN_STATE) {
      this.isOpen = true;
    }

    if (event.toState === FLYOUT_CLOSED_STATE) {
      this.isOpen = false;
      this.notifyClosed();
      this.cleanTemplate();
    }
  }

  public onHeaderGrabHandleMouseDown(event: MouseEvent): void {
    this.onResizeHandleMouseDown(event);
  }

  public onHeaderGrabHandleKeyDown(event: KeyboardEvent): void {
    if (event.key) {
      const direction = event.key.toLowerCase().replace('arrow', '');
      switch (direction) {
        case 'left':
          if (this.flyoutWidth < this.config.maxWidth) {
            this.flyoutWidth = Math.min(this.flyoutWidth + this.widthStep, this.config.maxWidth);
          }
          break;

        case 'right':
          if (this.flyoutWidth > this.config.minWidth) {
            this.flyoutWidth = Math.max(this.flyoutWidth - this.widthStep, this.config.minWidth);
          }
          break;

        /* istanbul ignore next */
        default:
          break;
      }
    }
  }

  public onResizeHandleMouseDown(event: MouseEvent): void {

    event.preventDefault();
    event.stopPropagation();

    if (this.isFullscreen) {
      return;
    }

    this.isDragging = true;
    this.xCoord = event.clientX;

    this.adapter.toggleIframePointerEvents(false);

    fromEvent(document, 'mousemove')
      .pipe(
        takeWhile(() => {
          return this.isDragging;
        })
      )
      .subscribe((moveEvent: any) => {
        this.onMouseMove(moveEvent);
      });

    fromEvent(document, 'mouseup')
      .pipe(
        takeWhile(() => {
          return this.isDragging;
        })
      )
      .subscribe((mouseUpEvent: any) => {
        this.onHandleRelease(mouseUpEvent);
      });
  }

  public onMouseMove(event: MouseEvent): void {
    /* Sanity check */
    /* istanbul ignore if */
    if (!this.isDragging) {
      return;
    }

    const offsetX = event.clientX - this.xCoord;
    let width = this.flyoutWidth;

    width -= offsetX;

    if (width < this.config.minWidth || width > this.config.maxWidth) {
      return;
    }

    if (window.innerWidth - width < this.windowBufferSize) {
      width = window.innerWidth - this.windowBufferSize;
      this.xCoord = this.windowBufferSize;
    } else {
      this.xCoord = event.clientX;
    }

    this.flyoutWidth = width;

    this.updateBreakpointAndResponsiveClass(this.flyoutWidth);

    this.changeDetector.markForCheck();
  }

  public onHandleRelease(event: MouseEvent): void {
    fromEvent(document, 'click')
      .pipe(take(1))
      .subscribe(() => {
        this.isDragging = false;
        this.adapter.toggleIframePointerEvents(true);
        this.setUserData();
      });
  }

  public onIteratorPreviousButtonClick(): void {
    this.flyoutInstance.iteratorPreviousButtonClick.emit();
  }

  public onIteratorNextButtonClick(): void {
    this.flyoutInstance.iteratorNextButtonClick.emit();
  }

  private createFlyoutInstance<T>(component: T): SkyFlyoutInstance<T> {
    const instance = new SkyFlyoutInstance<T>();

    instance.componentInstance = component;
    instance.hostController
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: SkyFlyoutMessage) => {
        this.messageStream.next(message);
      });

    return instance;
  }

  private handleIncomingMessages(message: SkyFlyoutMessage): void {
    /* tslint:disable-next-line:switch-default */
    switch (message.type) {
      case SkyFlyoutMessageType.Open:
        if (!this.isOpen) {
          this.isOpen = false;
          this.isOpening = true;
        }
        break;

      case SkyFlyoutMessageType.Close:
        this.isOpen = true;
        this.isOpening = false;
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

    this.changeDetector.markForCheck();
  }

  private notifyClosed(): void {
    this.flyoutInstance.closed.emit();
    this.flyoutInstance.closed.complete();
  }

  private cleanTemplate(): void {
    this.target.clear();
  }

  private updateBreakpointAndResponsiveClass(width: number): void {
    this.flyoutMediaQueryService.setBreakpointForWidth(width);

    const newBreakpiont = this.flyoutMediaQueryService.current;

    this.adapter.setResponsiveClass(this.elementRef, newBreakpiont);
  }

  private setFullscreen(): void {
    if ((window.innerWidth - this.windowBufferSize) < this.config.minWidth) {
      this.isFullscreen = true;
    } else {
      this.isFullscreen = false;
    }
  }

  private setUserData(): void {
    if (this.config.settingsKey) {
      this.uiConfigService.setConfig(
        this.config.settingsKey,
        {
          flyoutWidth: this.flyoutWidth
        }
      )
        .pipe(take(1))
        .subscribe(
          () => { },
          (err) => {
            console.warn('Could not save flyout data.');
            console.warn(err);
          }
        );
    }
  }

  private checkInitialSize(): void {
    if (this.flyoutWidth < this.config.minWidth) {
      this.flyoutWidth = this.config.minWidth;
      this.setUserData();
    } else if (this.flyoutWidth > this.config.maxWidth) {
      this.flyoutWidth = this.config.maxWidth;
      this.setUserData();
    }

    // Ensure flyout does not load larger than the window and its buffer
    if (window.innerWidth - this.flyoutWidth < this.windowBufferSize) {
      this.flyoutWidth = window.innerWidth - this.windowBufferSize;
      this.xCoord = this.windowBufferSize;
      this.setUserData();
    }

    if (this.flyoutMediaQueryService.isWidthWithinBreakpiont(window.innerWidth,
      SkyMediaBreakpoints.xs)) {
      this.updateBreakpointAndResponsiveClass(window.innerWidth);
    } else {
      this.updateBreakpointAndResponsiveClass(this.flyoutWidth);
    }

    this.setFullscreen();
  }

  private getString(key: string): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.resourcesService.getStringForLocale(
      { locale: 'en-US' },
      key
    );
  }
}
