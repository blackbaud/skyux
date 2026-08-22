import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormField,
  email,
  form,
  maxLength,
  required,
  validate,
} from '@angular/forms/signals';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyFluidGridModule } from '@skyux/layout';

/**
 * @title Input box with signal forms
 */
@Component({
  selector: 'app-forms-input-box-signal-forms-example',
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, SkyFluidGridModule, SkyInputBoxModule],
})
export class FormsInputBoxSignalFormsExample {
  protected model = signal({
    firstName: '',
    lastName: '',
    bio: '',
    email: '',
    favoriteColor: 'none',
  });

  protected memberForm = form(this.model, (p) => {
    required(p.firstName);
    required(p.lastName);
    maxLength(p.bio, 250);
    required(p.email);
    email(p.email);
    validate(p.favoriteColor, ({ value }) =>
      value() === 'invalid'
        ? { kind: 'invalidColor', message: 'Invalid color is not a color' }
        : undefined,
    );
  });
}
