import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Input,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { SkyIdModule } from '@skyux/core';

import { SkyFieldGroupHeadingLevel } from './field-group-heading-level';
import { SkyFieldGroupHeadingStyle } from './field-group-heading-style';

/**
 * Organizes form fields into a group.
 */
@Component({
  selector: 'sky-field-group',
  templateUrl: './field-group.component.html',
  styleUrl: './field-group.component.scss',
  standalone: true,
  imports: [CommonModule, SkyIdModule],
})
export class SkyFieldGroupComponent {
  /**
   * The text to display as the field group's label.
   * @preview
   */
  @Input({ required: true })
  public labelText!: string;

  /**
   * The text to display as the field group's label.
   * @preview
   */
  @Input()
  public hintText: string | undefined;

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

  /**
   * The heading level in the document structure.
   * @preview
   */
  @Input({ transform: numberAttribute })
  public headingLevel: SkyFieldGroupHeadingLevel = 3;

  /**
   * The heading font style.
   * @preview
   */
  @Input({ transform: numberAttribute })
  public set headingStyle(value: SkyFieldGroupHeadingStyle) {
    this.headingClass = `sky-font-heading-${value}`;
  }

  protected headingClass = 'sky-font-heading-3';
}
