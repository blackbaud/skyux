import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  QueryList,
  StaticProvider,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SKY_STACKING_CONTEXT, SkyDynamicComponentService } from '@skyux/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyToastResourcesModule } from '../shared/sky-toast-resources.module';

import { SkyToast } from './toast';
import { SkyToastAdapterService } from './toast-adapter.service';
import { SkyToastComponent } from './toast.component';
import { SkyToastService } from './toast.service';
import { SkyToasterService } from './toaster.service';
import { SkyToastContainerOptions } from './types/toast-container-options';
import { SkyToastDisplayDirection } from './types/toast-display-direction';

/**
 * @internal
 */
@Component({
  selector: 'sky-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  providers: [SkyToastAdapterService, SkyToasterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, SkyToastComponent, SkyToastResourcesModule],
})
export class SkyToasterComponent implements AfterViewInit, OnDestroy {
  public toastsForDisplay: SkyToast[] | undefined;

  @ViewChild('toaster')
  public toaster: ElementRef | undefined;

  @ViewChildren('toastContent', { read: ViewContainerRef })
  public toastContent: QueryList<ViewContainerRef> | undefined;

  @ViewChildren(SkyToastComponent)
  public toastComponents: QueryList<SkyToastComponent> | undefined;

  protected zIndex$ = new BehaviorSubject(1051);

  #ngUnsubscribe = new Subject<void>();
  #destroyed = false;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #containerOptions = inject(SkyToastContainerOptions, {
    optional: true,
  });
  readonly #dynamicComponentSvc = inject(SkyDynamicComponentService);
  readonly #domAdapter = inject(SkyToastAdapterService);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #toastService = inject(SkyToastService);
  readonly #toasterService = inject(SkyToasterService);

  public ngAfterViewInit(): void {
    if (this.toastContent) {
      this.toastContent.changes.subscribe(() => {
        this.#injectToastContent();
      });

      this.#toastService.toastStream
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((toasts: SkyToast[]) => {
          this.toastsForDisplay = this.#sortToastsForDisplay(toasts);

          // Scroll to the bottom of the toaster element when a new toast is added.
          if (
            this.toaster &&
            (!this.#containerOptions ||
              this.#containerOptions.displayDirection ===
                SkyToastDisplayDirection.OldestOnTop)
          ) {
            this.#domAdapter.scrollBottom(this.toaster);
          }

          this.#changeDetector.markForCheck();

          // Defer detectChanges to avoid re-entrant change detection when
          // noop animations cause transitionEnd to fire synchronously.
          void Promise.resolve().then(() => {
            if (!this.#destroyed) {
              this.#changeDetector.detectChanges();
            }
          });
        });
    }
  }

  public onToastClosed(toast: SkyToast): void {
    // Defer the close to avoid modifying the toast array (and potentially
    // destroying the host component) during an active change detection cycle.
    // With noop animations, the transitionEnd event fires synchronously
    // during CD, which would otherwise cause re-entrant view mutations.
    void Promise.resolve().then(() => toast.instance.close());
  }

  public closeAll(): void {
    // Sanity check
    /* istanbul ignore else */
    if (this.toastComponents) {
      for (const toastComponent of this.toastComponents) {
        toastComponent.close();
      }
    }
  }

  public onMouseEnter(): void {
    this.#toasterService.mouseOver.next(true);
  }

  public onMouseLeave(): void {
    this.#toasterService.mouseOver.next(false);
  }

  public onFocusIn(): void {
    this.#toasterService.focusIn.next(true);
  }

  public onFocusOut(): void {
    this.#toasterService.focusIn.next(false);
  }

  public ngOnDestroy(): void {
    this.#destroyed = true;
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #injectToastContent(): void {
    // Dynamically inject each toast's body content when the number of toasts changes.
    this.#toastService.toastStream.pipe(take(1)).subscribe((toasts) => {
      /* istanbul ignore else */
      if (this.toastContent) {
        for (const target of this.toastContent) {
          const toastId = this.#domAdapter.getToastId(target);

          const toast = toasts.find((item) => item.toastId === toastId);

          if (toast && !toast.isRendered) {
            target.clear();

            const providers = [
              ...toast.bodyComponentProviders,
              {
                provide: SKY_STACKING_CONTEXT,
                useValue: {
                  zIndex: this.zIndex$
                    .asObservable()
                    .pipe(takeUntil(this.#ngUnsubscribe)),
                },
              },
            ] as StaticProvider[];

            const componentRef = this.#dynamicComponentSvc.createComponent(
              toast.bodyComponent,
              {
                environmentInjector: this.#environmentInjector,
                providers,
              },
            );

            const toastEl = document.querySelector(
              `[data-toast-id="${toast.toastId}"]`,
            );

            /* istanbul ignore else */
            if (toastEl) {
              toastEl.appendChild(componentRef.location.nativeElement);
            }

            componentRef.changeDetectorRef.detectChanges();

            toast.isRendered = true;
          }
        }
      }
    });
  }

  #sortToastsForDisplay(toasts: SkyToast[]): SkyToast[] {
    const sortedToasts = toasts.slice();

    if (
      sortedToasts &&
      this.#containerOptions &&
      this.#containerOptions.displayDirection ===
        SkyToastDisplayDirection.NewestOnTop
    ) {
      sortedToasts.reverse();
    }

    return sortedToasts;
  }
}
