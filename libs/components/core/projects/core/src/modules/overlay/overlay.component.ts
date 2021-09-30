import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  StaticProvider,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  NavigationStart,
  Router
} from '@angular/router';

import {
  fromEvent,
  Observable,
  Subject,
  Subscription
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyCoreAdapterService
} from '../adapter-service/adapter.service';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayContext
} from './overlay-context';

/**
 * Omnibar is 1000.
 * See: https://github.com/blackbaud/auth-client/blob/master/src/omnibar/omnibar.ts#L139
 * ---
 * Modals start their z-indexes at 1040. However, each modal's z-index is a multiple of 10, so it
 * will be difficult to reliably predict a z-index that will always appear above all other
 * layers. Starting the z-index for overlays at a number much greater than modals will accommodate
 * the most reasonable of scenarios.
 * See: https://github.com/blackbaud/skyux-modals/blob/master/src/app/public/modules/modal/modal-host.service.ts#L22
 * (NOTE: It should be noted that modals do not use the overlay service, which is something we
 * should do in the near future to make sure z-indexes are predictable across all component
 * libraries.)
 */
let uniqueZIndex = 5000;

/**
 * @internal
 */
@Component({
  selector: 'sky-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyOverlayComponent implements OnInit, OnDestroy {

  public wrapperClass = '';

  public get backdropClick(): Observable<void> {
    return this._backdropClick.asObservable();
  }

  public get closed(): Observable<void> {
    return this._closed.asObservable();
  }

  public enablePointerEvents = false;

  public showBackdrop = false;

  public zIndex: string = `${++uniqueZIndex}`;

  @ViewChild('overlayContentRef', {
    read: ElementRef,
    static: true
  })
  private overlayContentRef: ElementRef;

  @ViewChild('overlayRef', {
    read: ElementRef,
    static: true
  })
  private overlayRef: ElementRef;

  @ViewChild('target', {
    read: ViewContainerRef,
    static: true
  })
  private targetRef: ViewContainerRef;

  private ngUnsubscribe = new Subject<void>();

  private routerSubscription: Subscription;

  private _backdropClick = new Subject<void>();

  private _closed = new Subject<void>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private coreAdapter: SkyCoreAdapterService,
    private context: SkyOverlayContext,
    @Optional() private router?: Router
  ) { }

  public ngOnInit(): void {
    this.applyConfig(this.context.config);

    setTimeout(() => {
      this.addBackdropClickListener();
    });

    if (this.context.config.closeOnNavigation) {
      this.addRouteListener();
    }
  }

  public ngOnDestroy(): void {
    this.removeRouteListener();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this._backdropClick.complete();

    this._closed.next();
    this._closed.complete();
  }

  public attachComponent<C>(component: Type<C>, providers: StaticProvider[] = []): ComponentRef<C> {
    this.targetRef.clear();

    const factory = this.resolver.resolveComponentFactory(component);
    const injector = Injector.create({
      providers,
      parent: this.injector
    });

    const componentRef = this.targetRef.createComponent<C>(factory, undefined, injector);

    // Run an initial change detection cycle after the component has been created.
    componentRef.changeDetectorRef.detectChanges();

    return componentRef;
  }

  public attachTemplate<T>(templateRef: TemplateRef<T>, context: T): EmbeddedViewRef<T> {
    this.targetRef.clear();

    return this.targetRef.createEmbeddedView(templateRef, context);
  }

  private applyConfig(config: SkyOverlayConfig): void {
    this.wrapperClass = config.wrapperClass || '';
    this.showBackdrop = config.showBackdrop;
    this.enablePointerEvents = config.enablePointerEvents;
    this.changeDetector.markForCheck();
  }

  private addBackdropClickListener(): void {
    fromEvent(window.document, 'click')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event: MouseEvent) => {
        const isChild = this.overlayContentRef.nativeElement.contains(event.target);
        const isAbove = this.coreAdapter.isTargetAboveElement(
          event.target,
          this.overlayRef.nativeElement
        );

        /* istanbul ignore else */
        if (!isChild && !isAbove) {
          this._backdropClick.next();
          if (this.context.config.enableClose) {
            this._closed.next();
          }
        }
      });
  }

  private addRouteListener(): void {
    /*istanbul ignore else*/
    if (this.router) {
      this.routerSubscription = this.router.events.subscribe(event => {
        /* istanbul ignore else */
        if (event instanceof NavigationStart) {
          this._closed.next();
        }
      });
    }
  }

  private removeRouteListener(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = undefined;
    }
  }
}
