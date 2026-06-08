import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  createEnvironmentInjector,
  inject,
} from '@angular/core';
import { SKY_STACKING_CONTEXT } from '@skyux/core';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  imports: [
    AsyncPipe,
    NgComponentOutlet,
    SkyToastComponent,
    SkyToastResourcesModule,
  ],
})
export class SkyToasterComponent implements OnInit, OnDestroy {
  public toastsForDisplay: SkyToast[] | undefined;

  @ViewChild('toaster')
  public toaster: ElementRef | undefined;

  @ViewChildren(SkyToastComponent)
  public toastComponents: QueryList<SkyToastComponent> | undefined;

  protected toastInjectors = new Map<number, EnvironmentInjector>();
  protected zIndex$ = new BehaviorSubject(1051);

  #ngUnsubscribe = new Subject<void>();

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #containerOptions = inject(SkyToastContainerOptions, {
    optional: true,
  });
  readonly #domAdapter = inject(SkyToastAdapterService);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #toastService = inject(SkyToastService);
  readonly #toasterService = inject(SkyToasterService);

  public ngOnInit(): void {
    this.#toastService.toastStream
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((toasts: SkyToast[]) => {
        this.#updateInjectors(toasts);
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
      });
  }

  public onToastClosed(toast: SkyToast): void {
    // Defer close to prevent the host from being destroyed during
    // its own change detection cycle.
    queueMicrotask(() => toast.instance.close());
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
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.toastInjectors.clear();
  }

  #updateInjectors(toasts: SkyToast[]): void {
    const activeIds = new Set(toasts.map((t) => t.toastId));

    // Remove entries for removed toasts.
    // The injector itself is destroyed by SkyToastComponent.ngOnDestroy
    // after the leave animation completes.
    for (const id of this.toastInjectors.keys()) {
      if (!activeIds.has(id)) {
        this.toastInjectors.delete(id);
      }
    }

    // Create injectors for new toasts.
    for (const toast of toasts) {
      if (!this.toastInjectors.has(toast.toastId)) {
        this.toastInjectors.set(
          toast.toastId,
          createEnvironmentInjector(
            [
              ...toast.bodyComponentProviders,
              {
                provide: SKY_STACKING_CONTEXT,
                useValue: {
                  zIndex: this.zIndex$
                    .asObservable()
                    .pipe(takeUntil(this.#ngUnsubscribe)),
                },
              },
            ],
            this.#environmentInjector,
          ),
        );
      }
    }
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
