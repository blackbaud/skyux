import {
  Component,
  ContentChildren,
  Input,
  QueryList,
  inject,
} from '@angular/core';
import { SkyContentInfoProvider } from '@skyux/core';

import { SkyToolbarSectionComponent } from './toolbar-section.component';

/**
 * Displays actions for lists, records, and tiles.
 */
@Component({
  selector: 'sky-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
  providers: [SkyContentInfoProvider],
})
export class SkyToolbarComponent {
  public hasSections = false;

  @ContentChildren(SkyToolbarSectionComponent, { descendants: true })
  public set sectionComponents(
    value: QueryList<SkyToolbarSectionComponent> | undefined
  ) {
    this.hasSections = !!value && value.length > 0;
  }

  /**
   * A descriptor term for the items that the toolbar actions are manipulating. This term should be plural and is used to construct context specific accessibility labels for the search inputs, sort menus, and filter buttons.
   * For example, if a value of 'constituents' is given the accessibility labels will default to values such as "Search constituents". For more information about accessibility labels, see the [WAI-ARIA definition for `aria-label`](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public set listDescriptor(value: string | undefined) {
    this.#contentInfoProvider.patchInfo({ descriptor: value });
  }

  #contentInfoProvider = inject(SkyContentInfoProvider);
}
