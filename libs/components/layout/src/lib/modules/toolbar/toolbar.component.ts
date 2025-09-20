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
  standalone: false,
})
export class SkyToolbarComponent {
  public hasSections = false;

  @ContentChildren(SkyToolbarSectionComponent, { descendants: true })
  public set sectionComponents(
    value: QueryList<SkyToolbarSectionComponent> | undefined,
  ) {
    this.hasSections = !!value && value.length > 0;
  }

  /**
   * A descriptor for the items that the toolbar manipulates. Use a plural term. The descriptor helps set the toolbar's `aria-label` attributes for search inputs, sort buttons, and filter buttons to provide text equivalents for screen readers [to support accessibility](https://developer.blackbaud.com/skyux/components/checkbox#accessibility).
   * For example, when the descriptor is "constituents," the search input's `aria-label` is "Search constituents." For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public set listDescriptor(value: string | undefined) {
    this.#contentInfoProvider.patchInfo({
      descriptor: value ? { type: 'text', value } : undefined,
    });
  }

  #contentInfoProvider = inject(SkyContentInfoProvider);
}
