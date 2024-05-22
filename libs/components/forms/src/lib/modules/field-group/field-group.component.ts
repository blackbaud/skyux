import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Input,
  TemplateRef,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyFormFieldLabelTextRequiredService } from '../shared/form-field-label-text-required.service';

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
  imports: [CommonModule, SkyHelpInlineModule, SkyIdModule],
  providers: [SkyFormFieldLabelTextRequiredService],
})
export class SkyFieldGroupComponent {
  /**
   * The text to display as the field group's heading.
   * @preview
   */
  @Input({ required: true })
  public headingText!: string;

  /**
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   * @preview
   */
  @Input()
  public hintText: string | undefined;

  /**
   * Indicates whether to hide the `headingText`.
   * @preview
   */
  @Input({ transform: booleanAttribute })
  public headingHidden = false;

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

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the field group heading. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
   * @preview
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   * @preview
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline) button is
   * placed beside the field group heading. Clicking the button invokes global help as configured by the application.
   * @preview
   */
  @Input()
  public helpKey: string | undefined;

  protected headingClass = 'sky-font-heading-3';
}
