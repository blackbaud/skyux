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

  @Input()
  public set listDescriptor(value: string | undefined) {
    this.#contentInfoProvider.patchInfo({ descriptor: value });
  }

  #contentInfoProvider = inject(SkyContentInfoProvider);
}
