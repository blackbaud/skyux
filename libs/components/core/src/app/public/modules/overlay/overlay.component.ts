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
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import {
  Subscription
} from 'rxjs/Subscription';

import 'rxjs/add/observable/fromEvent';

import 'rxjs/add/observable/of';

import 'rxjs/add/operator/takeUntil';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayContext
} from './overlay-context';

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

  public get closed(): Observable<void> {
    return this._closed.asObservable();
  }

  public showBackdrop = false;

  @ViewChild('overlayContentRef', { read: ElementRef })
  private overlayContentRef: ElementRef;

  @ViewChild('target', { read: ViewContainerRef })
  private targetRef: ViewContainerRef;

  private ngUnsubscribe = new Subject<void>();

  private routerSubscription: Subscription;

  private _closed = new Subject<void>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private elementRef: ElementRef,
    private injector: Injector,
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
    this._closed.complete();
  }

  public attachComponent<C>(component: Type<C>, providers: StaticProvider[] = []): ComponentRef<C> {
    this.targetRef.clear();

    const factory = this.resolver.resolveComponentFactory(component);
    const injector = Injector.create({
      providers,
      parent: this.injector
    });

    return this.targetRef.createComponent(factory, undefined, injector);
  }

  public attachTemplate<T>(templateRef: TemplateRef<T>, context: T): EmbeddedViewRef<T> {
    this.targetRef.clear();

    return this.targetRef.createEmbeddedView(templateRef, context);
  }

  private applyConfig(config: SkyOverlayConfig): void {
    this.showBackdrop = config.showBackdrop;
    this.changeDetector.markForCheck();
  }

  private addBackdropClickListener(): void {
    Observable.fromEvent(this.elementRef.nativeElement, 'click')
      .takeUntil(this.ngUnsubscribe)
      .subscribe((event: MouseEvent) => {
        if (this.context.config.enableClose) {
          const isChild = this.overlayContentRef.nativeElement.contains(event.target);
          /* istanbul ignore else */
          if (!isChild) {
            this._closed.next();
            this._closed.complete();
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
          this._closed.complete();
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
