import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Input,
  booleanAttribute,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SkyIdService } from '@skyux/core';

import { SKY_FORM_ERRORS_ENABLED } from '../form-error/form-errors-enabled-token';
import { SkyFormErrorsModule } from '../form-error/form-errors.module';

/**
 * Organizes checkboxes into a group.
 */
@Component({
  selector: 'sky-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, SkyFormErrorsModule],
  providers: [{ provide: SKY_FORM_ERRORS_ENABLED, useValue: true }],
})
export class SkyCheckboxGroupComponent {
  /**
   * The text to display as the radio group's label.
   * @preview
   */
  @Input({ required: true })
  public labelText!: string;

  /**
   * Indicates whether to hide the `labelText`.
   * @preview
   */
  @Input({ transform: booleanAttribute })
  public labelHidden = false;

  /**
   * Whether the checkbox group is stacked on another form component. When specified, the appropriate
   * vertical spacing is automatically added to the checkbox group.
   */
  @Input({ transform: booleanAttribute })
  public set stacked(value: boolean) {
    this.cssClass = value ? 'sky-margin-stacked-lg' : '';
  }

  /**
   * The form group that contains the group of checkboxes.
   * @preview
   */
  @Input({ required: true })
  public formGroup!: FormGroup;

  @HostBinding('class')
  public cssClass = '';

  readonly #idSvc = inject(SkyIdService);
  protected errorId = this.#idSvc.generateId();
  protected formErrorsDataId = 'checkbox-group-form-errors';
}
