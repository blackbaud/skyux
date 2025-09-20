import { Component, inject } from '@angular/core';
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
  standalone: true,
  template: `required: {{ requiredState.isRequired() }}`,
})
export class TestControlComponent implements ControlValueAccessor {
  protected readonly requiredState = inject(SkyRequiredStateDirective);

  constructor() {
    const ngControl = inject(NgControl, { optional: true });
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
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
