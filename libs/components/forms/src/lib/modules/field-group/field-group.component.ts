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
import { SkyThemeModule } from '@skyux/theme';

import { SkyFieldGroupHeadingLevel } from './field-group-heading-level';
import { SkyFieldGroupHeadingStyle } from './field-group-heading-style';

function numberAttribute3(value: unknown): number {
  return numberAttribute(value, 3);
}

/**
 * Organizes form fields into a group.
 */
@Component({
  selector: 'sky-field-group',
  templateUrl: './field-group.component.html',
  styleUrl: './field-group.component.scss',
  imports: [CommonModule, SkyHelpInlineModule, SkyIdModule, SkyThemeModule],
})
export class SkyFieldGroupComponent {
  /**
   * The text to display as the field group's heading.
   */
  @Input({ required: true })
  public headingText!: string;

  /**
   * [Persistent inline help text](https://developer.blackbaud.com/skyux/design/guidelines/user-assistance#inline-help) that provides
   * additional context to the user.
   */
  @Input()
  public hintText: string | undefined;

  /**
   * Indicates whether to hide the `headingText`.
   */
  @Input({ transform: booleanAttribute })
  public headingHidden = false;

  /**
   * Whether the field group is stacked on another field group. When specified, the appropriate
   * vertical spacing is automatically added to the field group.
   */
  @Input({ transform: booleanAttribute })
  @HostBinding('class.sky-field-group-stacked')
  public stacked = false;

  /**
   * The semantic heading level in the document structure.
   * @default 3
   */
  @Input({ transform: numberAttribute3 })
  public headingLevel: SkyFieldGroupHeadingLevel = 3;

  /**
   * The heading [font style](https://developer.blackbaud.com/skyux/design/styles/typography#headings).
   * @default 3
   */
  @Input({ transform: numberAttribute3 })
  public set headingStyle(value: SkyFieldGroupHeadingStyle) {
    this.headingClass = `sky-font-heading-${value}`;
  }

  /**
   * The content of the help popover. When specified along with `headingText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the field group heading. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title. This property only applies when `headingText` is also specified.
   */
  @Input()
  public helpPopoverContent: string | TemplateRef<unknown> | undefined;

  /**
   * The title of the help popover. This property only applies when `helpPopoverContent` is
   * also specified.
   */
  @Input()
  public helpPopoverTitle: string | undefined;

  /**
   * A help key that identifies the global help content to display. When specified along with `headingText`, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is placed beside the field group heading. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help)
   * as configured by the application. This property only applies when `headingText` is also specified.
   */
  @Input()
  public helpKey: string | undefined;

  protected headingClass = 'sky-font-heading-3';
}
