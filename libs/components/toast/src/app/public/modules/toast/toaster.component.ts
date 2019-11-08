// #region imports
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  Injector,
  OnDestroy,
  Optional,
  ReflectiveInjector,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/take';

import {
  SkyToast
} from './toast';

import {
  SkyToastAdapterService
} from './toast-adapter.service';

import {
  SkyToastComponent
} from './toast.component';

import {
  SkyToastService
} from './toast.service';

import {
  SkyToasterService
} from './toaster.service';

import {
  SkyToastContainerOptions
} from './types/toast-container-options';

import {
  SkyToastDisplayDirection
} from './types/toast-display-direction';

// #endregion

@Component({
  selector: 'sky-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  providers: [SkyToasterService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyToasterComponent implements AfterViewInit, OnDestroy {
  public toastsForDisplay: SkyToast[];

  public get toastStream(): Observable<SkyToast[]> {
    return this.toastService.toastStream;
  }

  @ViewChild('toaster')
  private toaster: ElementRef;

  @ViewChildren('toastContent', { read: ViewContainerRef })
  private toastContent: QueryList<ViewContainerRef>;

  @ViewChildren(SkyToastComponent)
  private toastComponents: QueryList<SkyToastComponent>;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private domAdapter: SkyToastAdapterService,
    private toastService: SkyToastService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private toasterService: SkyToasterService,
    private changeDetector: ChangeDetectorRef,
    @Optional() private containerOptions?: SkyToastContainerOptions
  ) { }

  public ngAfterViewInit(): void {
    this.injectToastContent();
    this.toastContent.changes.subscribe(() => {
      this.injectToastContent();
    });

    this.toastStream
      .takeUntil(this.ngUnsubscribe)
      .subscribe((toasts: SkyToast[]) => {
        this.toastsForDisplay = this.sortToastsForDisplay(toasts);

        // Scroll to the bottom of the toaster element when a new toast is added.
        if (
          !this.containerOptions ||
          this.containerOptions.displayDirection === SkyToastDisplayDirection.OldestOnTop
        ) {
          this.domAdapter.scrollBottom(this.toaster);
        }

        this.changeDetector.detectChanges();
      });
  }

  @HostListener('click', ['$event'])
  public onHostClick(event: any): void {
    event.stopPropagation();
  }

  public onToastClosed(toast: SkyToast): void {
    toast.instance.close();
  }

  public closeAll(): void {
    /* istanbul ignore else */
    // Sanity check
    if (this.toastComponents) {
      this.toastComponents.forEach((toastComponent) => {
        toastComponent.close();
      });
    }
  }

  public onMouseEnter(): void {
    this.toasterService.mouseOver.next(true);
  }

  public onMouseLeave(): void {
    this.toasterService.mouseOver.next(false);
  }

  public onFocusIn(): void {
    this.toasterService.focusIn.next(true);
  }

  public onFocusOut(): void {
    this.toasterService.focusIn.next(false);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private injectToastContent(): void {
    // Dynamically inject each toast's body content when the number of toasts changes.
    this.toastService.toastStream.take(1).subscribe((toasts) => {
      this.toastContent.toArray().forEach((target: ViewContainerRef, i: number) => {
        const toastId = this.domAdapter.getToastId(target);

        const toast = toasts.find(item => item.toastId === toastId);

        if (!toast.isRendered) {
          target.clear();

          const componentFactory = this.resolver.resolveComponentFactory(toast.bodyComponent);
          const injector = ReflectiveInjector.fromResolvedProviders(
            ReflectiveInjector.resolve(toast.bodyComponentProviders),
            this.injector
          );

          const componentRef = target.createComponent(componentFactory, undefined, injector);
          componentRef.changeDetectorRef.detectChanges();

          toast.isRendered = true;
        }
      });
    });
  }

  private sortToastsForDisplay(toasts: SkyToast[]) {
    let sortedToasts = toasts && toasts.slice();

    if (
      sortedToasts &&
      this.containerOptions &&
      this.containerOptions.displayDirection === SkyToastDisplayDirection.NewestOnTop
    ) {
      sortedToasts.reverse();
    }

    return sortedToasts;
  }
}
