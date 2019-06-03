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
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
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
  SkyFlyoutAction,
  SkyFlyoutConfig,
  SkyFlyoutMessage,
  SkyFlyoutMessageType,
  SkyFlyoutPermalink
} from './types';

const FLYOUT_OPEN_STATE = 'flyoutOpen';
const FLYOUT_CLOSED_STATE = 'flyoutClosed';

let nextId = 0;

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyFlyoutComponent implements OnDestroy, OnInit {
  public config: SkyFlyoutConfig;
  public flyoutId: string = `sky-flyout-${++nextId}`;
  public flyoutState = FLYOUT_CLOSED_STATE;
  public isOpen = false;
  public isOpening = false;

  public flyoutWidth = 0;
  public isDragging = false;
  private xCoord = 0;

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

  @ViewChild('target', { read: ViewContainerRef })
  private target: ViewContainerRef;

  @ViewChild('flyoutHeader')
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
    private elementRef: ElementRef
  ) {
    // All commands flow through the message stream.
    this.messageStream
      .takeUntil(this.ngUnsubscribe)
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

  @HostListener('click', ['$event'])
  public onHostClick(event: any): void {
    event.stopPropagation();
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(event: any): void {
    if (this.flyoutMediaQueryService.isWidthWithinBreakpiont(event.target.innerWidth,
      SkyMediaBreakpoints.xs)) {
        this.updateBreakpointAndResponsiveClass(event.target.innerWidth);
    } else {
      this.updateBreakpointAndResponsiveClass(this.flyoutWidth);
    }
  }

  public attach<T>(component: Type<T>, config: SkyFlyoutConfig): SkyFlyoutInstance<T> {
    this.cleanTemplate();

    // Emit the closed event on any previously opened flyout instance
    if (this.flyoutInstance) {
      this.notifyClosed();
    }

    this.config = Object.assign({ providers: [] }, config);
    this.config.defaultWidth = this.config.defaultWidth || 500;
    this.config.minWidth = this.config.minWidth || 320;
    this.config.maxWidth = this.config.maxWidth || this.config.defaultWidth;

    this.config.showIterator = this.config.showIterator || false;
    this.config.iteratorNextButtonDisabled = this.config.iteratorNextButtonDisabled || false;
    this.config.iteratorPreviousButtonDisabled = this.config.iteratorPreviousButtonDisabled || false;

    const factory = this.resolver.resolveComponentFactory(component);
    const providers = ReflectiveInjector.resolve(this.config.providers);
    const injector = ReflectiveInjector.fromResolvedProviders(providers, this.injector);
    const componentRef = this.target.createComponent(factory, undefined, injector);

    this.flyoutInstance = this.createFlyoutInstance<T>(componentRef.instance);

    // Open the flyout immediately.
    this.messageStream.next({
      type: SkyFlyoutMessageType.Open
    });

    this.flyoutWidth = this.config.defaultWidth;

    if (this.flyoutMediaQueryService.isWidthWithinBreakpiont(window.innerWidth,
      SkyMediaBreakpoints.xs)) {
        this.updateBreakpointAndResponsiveClass(window.innerWidth);
    } else {
      this.updateBreakpointAndResponsiveClass(this.flyoutWidth);
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

  public onMouseDown(event: MouseEvent): void {

    event.preventDefault();
    event.stopPropagation();

    if (this.flyoutMediaQueryService.isWidthWithinBreakpiont(window.innerWidth,
      SkyMediaBreakpoints.xs)) {
        return;
    }

    this.isDragging = true;
    this.xCoord = event.clientX;

    this.adapter.toggleIframePointerEvents(false);

    Observable
      .fromEvent(document, 'mousemove')
      .takeWhile(() => {
        return this.isDragging;
      })
      .subscribe((moveEvent: any) => {
        this.onMouseMove(moveEvent);
      });

    Observable
      .fromEvent(document, 'mouseup')
      .takeWhile(() => {
        return this.isDragging;
      })
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

    this.flyoutWidth = width;

    this.updateBreakpointAndResponsiveClass(this.flyoutWidth);

    this.xCoord = event.clientX;
    this.changeDetector.detectChanges();
  }

  public onHandleRelease(event: MouseEvent): void {
    this.isDragging = false;
    this.adapter.toggleIframePointerEvents(true);
    this.changeDetector.detectChanges();
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
      .takeUntil(this.ngUnsubscribe)
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

  private getString(key: string): string {
    // TODO: Need to implement the async `getString` method in a breaking change.
    return this.resourcesService.getStringForLocale(
      { locale: 'en-US' },
      key
    );
  }
}
