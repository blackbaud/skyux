import {
  Component,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';

import { SkyDescriptionListDescriptionComponent } from './description-list-description.component';
import { SkyDescriptionListTermComponent } from './description-list-term.component';

/**
 * Wraps the term-description pairs in the description list.
 */
@Component({
  selector: 'sky-description-list-content',
  templateUrl: './description-list-content.component.html',
  standalone: false,
})
export class SkyDescriptionListContentComponent {
  @ContentChildren(SkyDescriptionListTermComponent)
  public termComponents: QueryList<SkyDescriptionListTermComponent> | undefined;

  @ContentChildren(SkyDescriptionListDescriptionComponent)
  public descriptionComponents:
    | QueryList<SkyDescriptionListDescriptionComponent>
    | undefined;

  /**
   * A help key that identifies the global help content to display. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline) button is
   * placed beside the description list content label. Clicking the button invokes [global help](https://developer.blackbaud.com/skyux/learn/develop/global-help) as configured by the application.
   */
  @Input()
  public helpKey: string | undefined;

  /**
   * The content of the help popover. When specified, a [help inline](https://developer.blackbaud.com/skyux/components/help-inline)
   * button is added to the description list content. The help inline button displays a [popover](https://developer.blackbaud.com/skyux/components/popover)
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
}
