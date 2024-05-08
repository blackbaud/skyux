import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  Output,
  booleanAttribute,
  inject,
} from '@angular/core';
import { NgControl, Validators } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

/**
 * A host directive used to capture the "required" state of the host's form control.
 * @internal
 */
@Directive({
  standalone: true,
})
export class SkyRequiredStateDirective implements OnDestroy, AfterViewInit {
  @Input({ transform: booleanAttribute })
  public set required(value: boolean) {
    this.#_required = value;
    this.isRequired();
  }

  public get required(): boolean {
    return this.#_required;
  }

  @Output()
  public requiredStateChange = new EventEmitter();

  /**
   * Whether the `required` attribute is set to `true`, or the control includes
   * the `Validators.required` validator.
   */
  public isRequired(): boolean {
    const requiredState =
      this.required ||
      !!this.#ngControl?.control?.hasValidator(Validators.required);

    if (requiredState !== this.#currentRequiredState) {
      this.#currentRequiredState = requiredState;
      this.requiredStateChange.emit(requiredState);
    }

    return requiredState;
  }

  #_required = false;

  #currentRequiredState = false;
  #injector = inject(Injector);
  #ngControl?: NgControl | null;
  readonly #ngUnsubscribe = new Subject<void>();

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public ngAfterViewInit(): void {
    this.#ngControl = this.#injector.get(NgControl, undefined, {
      optional: true,
      self: true,
    });

    this.#ngControl?.statusChanges
      ?.pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.isRequired();
      });

    this.isRequired();
  }
}
