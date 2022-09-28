import { Component, ContentChildren, QueryList } from '@angular/core';

import { SkyToolbarSectionComponent } from './toolbar-section.component';

/**
 * Displays actions for lists, records, and tiles.
 */
@Component({
  selector: 'sky-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
})
export class SkyToolbarComponent {
  public hasSections = false;

  @ContentChildren(SkyToolbarSectionComponent, { descendants: true })
  public set sectionComponents(
    value: QueryList<SkyToolbarSectionComponent> | undefined
  ) {
    this.hasSections = !!value && value.length > 0;
  }
}
