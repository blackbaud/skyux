import {
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
  inject,
} from '@angular/core';
import { SkyDefaultInputProvider } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyToolbarSectionComponent } from './toolbar-section.component';

/**
 * Displays actions for lists, records, and tiles.
 */
@Component({
  selector: 'sky-toolbar',
  styleUrls: ['./toolbar.component.scss'],
  templateUrl: './toolbar.component.html',
  providers: [SkyDefaultInputProvider],
})
export class SkyToolbarComponent implements OnDestroy {
  public hasSections = false;

  @ContentChildren(SkyToolbarSectionComponent, { descendants: true })
  public set sectionComponents(
    value: QueryList<SkyToolbarSectionComponent> | undefined
  ) {
    this.hasSections = !!value && value.length > 0;
  }

  @Input()
  public set listDescriptor(value: string | undefined) {
    this.#listDescriptorResourcesUnsubscribe.next();
    console.log(value);
    if (value) {
      this.#resourcesSvc
        .getStrings({
          filterResource: ['skyux_toolbar_filter_aria_label_descriptor', value],
          searchResource: ['skyux_toolbar_search_aria_label_descriptor', value],
          sortResource: ['skyux_toolbar_sort_aria_label_descriptor', value],
        })
        .pipe(takeUntil(this.#listDescriptorResourcesUnsubscribe))
        .subscribe((values) => {
          this.#defaultInputProvider.setValue(
            'filter',
            'ariaLabel',
            values.filterResource
          );
          this.#defaultInputProvider.setValue(
            'search',
            'ariaLabel',
            values.searchResource
          );
          this.#defaultInputProvider.setValue(
            'sort',
            'ariaLabel',
            values.sortResource
          );
        });
    } else {
      this.#defaultInputProvider.setValue('filter', 'ariaLabel', undefined);
      this.#defaultInputProvider.setValue('search', 'ariaLabel', undefined);
      this.#defaultInputProvider.setValue('sort', 'ariaLabel', undefined);
    }
  }

  #defaultInputProvider = inject(SkyDefaultInputProvider);
  #listDescriptorResourcesUnsubscribe = new Subject<void>();
  #resourcesSvc = inject(SkyLibResourcesService);

  public ngOnDestroy(): void {
    this.#listDescriptorResourcesUnsubscribe.next();
    this.#listDescriptorResourcesUnsubscribe.complete();
  }
}
