import { Component, signal } from '@angular/core';
import {
  FormField,
  email,
  form,
  maxLength,
  required,
} from '@angular/forms/signals';
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  imports: [FormField, SkyInputBoxModule],
  template: `
    <div style="max-width: 300px;">
      <sky-input-box labelText="Name" [stacked]="true">
        <input type="text" [formField]="signalForm.name" />
      </sky-input-box>

      <sky-input-box
        labelText="Email"
        helpPopoverContent="Enter a valid email address."
        [stacked]="true"
      >
        <input type="text" [formField]="signalForm.email" />
      </sky-input-box>

      <sky-input-box labelText="Bio" [characterLimit]="200" [stacked]="true">
        <textarea [formField]="signalForm.bio"></textarea>
      </sky-input-box>

      <button type="button" (click)="signalForm().markAsTouched()">
        Validate
      </button>
    </div>
  `,
})
export class InputBoxSignalFormsComponent {
  protected readonly model = signal({
    name: '',
    email: '',
    bio: '',
  });

  protected readonly signalForm = form(this.model, (p) => {
    required(p.name);
    required(p.email);
    email(p.email);
    maxLength(p.bio, 200);
  });
}
