import { DestroyRef, Injectable, OnDestroy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable, Subject, fromEvent } from 'rxjs';

import { SkyDatepickerComponent } from './datepicker.component';

/**
 * Handles interactions between the datepicker host component and the input
 * directive.
 * @internal
 */
@Injectable()
export class SkyDatepickerHostService implements OnDestroy {
  readonly #destroyRef = inject(DestroyRef);

  /**
   * Fires when the picker or trigger button loses focus.
   */
  public get focusout(): Observable<FocusEvent> {
    return this.#focusoutObs;
  }

  #focusout = new Subject<FocusEvent>();
  #focusoutObs = this.#focusout.asObservable();
  #host: SkyDatepickerComponent | undefined;
  #isInitialized = false;

  public ngOnDestroy(): void {
    this.#focusout.complete();
  }

  public init(host: SkyDatepickerComponent): void {
    if (this.#isInitialized) {
      throw new Error('The datepicker host service is already initialized.');
    }

    this.#host = host;
    this.#isInitialized = true;

    const triggerButtonEl: Element | undefined =
      this.#host.triggerButtonRef?.nativeElement;

    if (triggerButtonEl instanceof Element) {
      fromEvent<FocusEvent>(triggerButtonEl, 'focusout')
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((evt) => {
          this.#handleFocusoutEvent(evt);
        });
    }
  }

  public isFocusingDatepicker(evt: FocusEvent): boolean {
    const buttonEl = this.#host?.triggerButtonRef?.nativeElement;

    return buttonEl instanceof Element && buttonEl === evt.relatedTarget;
  }

  #handleFocusoutEvent(evt: FocusEvent): void {
    if (this.#host) {
      const relatedTarget = evt.relatedTarget;
      const overlayEl: HTMLElement | undefined =
        this.#host.getPickerRef()?.nativeElement;

      const isFocusingOverlay =
        relatedTarget instanceof Element &&
        !!overlayEl?.contains(relatedTarget);

      if (relatedTarget === null || !isFocusingOverlay) {
        this.#focusout.next(evt);
      }
    }
  }
}
