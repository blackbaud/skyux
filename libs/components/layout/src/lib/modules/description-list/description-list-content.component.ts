import { Component, ContentChildren, QueryList } from '@angular/core';

import { SkyDescriptionListDescriptionComponent } from './description-list-description.component';
import { SkyDescriptionListTermComponent } from './description-list-term.component';

/**
 * Wraps the term-description pairs in the description list.
 */
@Component({
  selector: 'sky-description-list-content',
  templateUrl: './description-list-content.component.html',
})
export class SkyDescriptionListContentComponent {
  @ContentChildren(SkyDescriptionListTermComponent)
  public termComponents: QueryList<SkyDescriptionListTermComponent>;

  @ContentChildren(SkyDescriptionListDescriptionComponent)
  public descriptionComponents: QueryList<SkyDescriptionListDescriptionComponent>;
}
