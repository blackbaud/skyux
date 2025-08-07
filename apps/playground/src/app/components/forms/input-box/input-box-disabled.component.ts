import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  imports: [FormsModule, ReactiveFormsModule, SkyInputBoxModule],
  template: `
    <form novalidate [formGroup]="formGroup">
      <div style="max-width: 200px;">
        <sky-input-box labelText="Disabled form control" [stacked]="true">
          <input formControlName="formControl1" type="text" />
        </sky-input-box>

        <sky-input-box
          labelText="Disabled input box"
          [disabled]="true"
          [stacked]="true"
        >
          <input type="text" value="Some value" />
        </sky-input-box>

        <sky-input-box labelText="Disabled input element" [stacked]="true">
          <input disabled type="text" value="Some value" />
        </sky-input-box>

        <sky-input-box
          labelText="Disabled input box and input element"
          [disabled]="true"
          [stacked]="true"
        >
          <input disabled type="text" value="Some value" />
        </sky-input-box>

        <sky-input-box
          labelText="Disabled input box, input element, and form control"
          [disabled]="true"
          [stacked]="true"
        >
          <input disabled formControlName="formControl2" type="text" />
        </sky-input-box>

        <sky-input-box stacked="true">
          <label class="sky-control-label"> Disabled (not "easy" mode) </label>
          <input
            class="sky-form-control"
            formControlName="formControl3"
            skyId
            type="text"
            value="Disabled value"
          />
        </sky-input-box>
      </div>
    </form>
  `,
})
export class InputBoxDisabledComponent {
  protected formGroup = inject(FormBuilder).group({
    formControl1: new FormControl({ disabled: true, value: 'Some value' }),
    formControl2: new FormControl({ disabled: true, value: 'Some value' }),
    formControl3: new FormControl({ disabled: true, value: 'Some value' }),
  });
}
