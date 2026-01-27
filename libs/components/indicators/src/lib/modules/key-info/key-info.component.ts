import { NgClass } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SkyKeyInfoLayoutType } from './key-info-layout-type';

@Component({
  imports: [NgClass, SkyHelpInlineModule, SkyIdModule],
  selector: 'sky-key-info',
  templateUrl: './key-info.component.html',
  styleUrl: './key-info.component.scss',
})
export class SkyKeyInfoComponent {
  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline) button is
   * placed beside the key info. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help) as configured by the application.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the key info. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
   * when clicked using the specified content and optional title.
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
   * The layout for the key info. The vertical layout places the label under the
   * value, while the horizontal layout places the label beside the value.
   * @default "vertical"
   */
  @Input()
  public layout: SkyKeyInfoLayoutType | undefined = 'vertical';
}
