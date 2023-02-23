import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  HostBinding,
  Injector,
  OnDestroy,
  OnInit,
  Optional,
  StaticProvider,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  fromEvent,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyCoreAdapterService } from '../adapter-service/adapter.service';
import { SkyIdService } from '../id/id.service';
import { SkyStackingContextService } from '../stacking-context/stacking-context.service';

import { SkyOverlayConfig } from './overlay-config';
import { SkyOverlayContext } from './overlay-context';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyOverlayComponent implements OnInit, OnDestroy {
  public wrapperClass = '';

  public get backdropClick(): Observable<void> {
    return this.#backdropClickObs;
  }

  public get closed(): Observable<void> {
    return this.#closedObs;
  }

  public enablePointerEvents = false;

  @HostBinding('id')
  public id: string;

  public showBackdrop = false;

  public zIndex = `${++uniqueZIndex}`;

  protected clipPath$ = new ReplaySubject<string | undefined>(1);

  @ViewChild('overlayContentRef', {
    read: ElementRef,
    static: true,
  })
  public overlayContentRef: ElementRef | undefined;

  @ViewChild('overlayRef', {
    read: ElementRef,
    static: true,
  })
  public overlayRef: ElementRef | undefined;

  @ViewChild('target', {
    read: ViewContainerRef,
    static: true,
  })
  public targetRef: ViewContainerRef | undefined;

  #backdropClick: Subject<void>;

  #backdropClickObs: Observable<void>;

  #changeDetector: ChangeDetectorRef;

  #closed: Subject<void>;

  #closedObs: Observable<void>;

  #context: SkyOverlayContext;

  #coreAdapter: SkyCoreAdapterService;

  #injector: Injector;

  #ngUnsubscribe = new Subject<void>();

  #router: Router | undefined;

  #routerSubscription: Subscription | undefined;

  constructor(
    changeDetector: ChangeDetectorRef,
    injector: Injector,
    coreAdapter: SkyCoreAdapterService,
    context: SkyOverlayContext,
    idSvc: SkyIdService,
    @Optional() router?: Router
  ) {
    this.#changeDetector = changeDetector;
    this.#injector = injector;
    this.#coreAdapter = coreAdapter;
    this.#context = context;
    this.#router = router;

    this.id = idSvc.generateId();

    this.#backdropClick = new Subject<void>();
    this.#closed = new Subject<void>();

    this.#backdropClickObs = this.#backdropClick.asObservable();
    this.#closedObs = this.#closed.asObservable();
  }

  public ngOnInit(): void {
    this.#applyConfig(this.#context.config);

    setTimeout(() => {
      this.#addBackdropClickListener();
    });

    if (this.#context.config.closeOnNavigation) {
      this.#addRouteListener();
    }
  }

  public ngOnDestroy(): void {
    this.#removeRouteListener();
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#backdropClick.complete();

    this.#closed.next();
    this.#closed.complete();
  }

  public attachComponent<C>(
    component: Type<C>,
    providers: StaticProvider[] = []
  ): ComponentRef<C> {
    /*istanbul ignore if: untestable*/
    if (!this.targetRef) {
      throw new Error(
        '[SkyOverlayComponent] Could not attach the component because the target element could not be found.'
      );
    }

    this.targetRef.clear();

    providers.push({
      provide: SkyStackingContextService,
      useValue: new SkyStackingContextService({
        zIndex: parseInt(this.zIndex, 10),
      }),
    });

    const injector = Injector.create({
      providers,
      parent: this.#injector,
    });

    const componentRef = this.targetRef.createComponent<C>(component, {
      injector,
    });

    // Run an initial change detection cycle after the component has been created.
    componentRef.changeDetectorRef.detectChanges();

    return componentRef;
  }

  public attachTemplate<T>(
    templateRef: TemplateRef<T>,
    context: T
  ): EmbeddedViewRef<T> {
    /*istanbul ignore if: untestable*/
    if (!this.targetRef) {
      throw new Error(
        '[SkyOverlayComponent] Could not attach the template because the target element could not be found.'
      );
    }

    this.targetRef.clear();

    return this.targetRef.createEmbeddedView(templateRef, context);
  }

  public updateClipPath(clipPath: string | undefined): void {
    this.clipPath$.next(clipPath);
  }

  #applyConfig(config: SkyOverlayConfig): void {
    this.wrapperClass = config.wrapperClass || '';
    this.showBackdrop = !!config.showBackdrop;
    this.enablePointerEvents = !!config.enablePointerEvents;
    this.#changeDetector.markForCheck();
  }

  #addBackdropClickListener(): void {
    fromEvent<MouseEvent>(window.document, 'click')
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((event) => {
        if (event.target && this.overlayContentRef && this.overlayRef) {
          const isChild = this.overlayContentRef.nativeElement.contains(
            event.target
          );

          const isAbove = this.#coreAdapter.isTargetAboveElement(
            event.target,
            this.overlayRef.nativeElement
          );

          /* istanbul ignore else */
          if (!isChild && !isAbove) {
            this.#backdropClick.next();
            if (this.#context.config.enableClose) {
              this.#closed.next();
            }
          }
        }
      });
  }

  #addRouteListener(): void {
    /*istanbul ignore else*/
    if (this.#router) {
      this.#routerSubscription = this.#router.events.subscribe((event) => {
        /* istanbul ignore else */
        if (event instanceof NavigationStart) {
          this.#closed.next();
        }
      });
    }
  }

  #removeRouteListener(): void {
    if (this.#routerSubscription) {
      this.#routerSubscription.unsubscribe();
      this.#routerSubscription = undefined;
    }
  }
}
