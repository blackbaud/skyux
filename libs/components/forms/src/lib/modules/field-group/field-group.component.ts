import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, booleanAttribute } from '@angular/core';

/**
 * Organizes form fields into a group.
 */
@Component({
  selector: 'sky-field-group',
  templateUrl: './field-group.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .sky-field-group-content {
        margin-top: var(--sky-margin-stacked-sm);
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class SkyFieldGroupComponent {
  /**
   * The text to display as the field group's label.
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
   * Whether the field group is stacked on another field group. When specified, the appropriate
   * vertical spacing is automatically added to the field group.
   * @preview
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-margin-stacked-xl')
  public stacked = false;
}
