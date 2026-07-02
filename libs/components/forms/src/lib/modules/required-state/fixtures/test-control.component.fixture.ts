import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { SkyRequiredStateDirective } from '../required-state.directive';

@Component({
  hostDirectives: [
    {
      directive: SkyRequiredStateDirective,
      inputs: ['required'],
    },
  ],
  selector: 'sky-test-control',
  template: `required: {{ requiredState.isRequired() }}`,
})
export class TestControlComponent
  implements ControlValueAccessor, AfterViewInit
{
  protected readonly requiredState = inject(SkyRequiredStateDirective);

  readonly #cdr = inject(ChangeDetectorRef);
  readonly #ngControl = inject(NgControl, { optional: true });

  constructor() {
    if (this.#ngControl) {
      this.#ngControl.valueAccessor = this;
    }
  }

  public ngAfterViewInit(): void {
    this.#ngControl?.control?.statusChanges.subscribe(() =>
      this.#cdr.markForCheck(),
    );
  }

  public registerOnChange(): void {
    /* */
  }

  public registerOnTouched(): void {
    /* */
  }

  public writeValue(): void {
    /* */
  }
}
