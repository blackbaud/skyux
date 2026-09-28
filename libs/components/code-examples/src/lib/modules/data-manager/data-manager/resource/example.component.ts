import {
  ChangeDetectionStrategy,
  Component,
  computed,
  resource,
  signal,
} from '@angular/core';
import {
  SkyDataManagerModule,
  SkyDataManagerSortOption,
} from '@skyux/data-manager';

import { getServerItems } from './data';

/**
 * @title Data manager with a server-side resource data source
 */
@Component({
  selector: 'app-data-manager-resource-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataManagerModule],
})
export class DataManagerResourceExampleComponent {
  protected readonly searchText = signal('');
  protected readonly sort = signal<SkyDataManagerSortOption | undefined>(
    undefined,
  );

  protected readonly data = resource({
    params: () => ({ searchText: this.searchText(), sort: this.sort() }),
    loader: async ({ params }) => {
      // Simulates an asynchronous server request.
      await Promise.resolve();

      return getServerItems({
        searchText: params.searchText,
        sort: params.sort
          ? {
              propertyName: params.sort.propertyName,
              descending: params.sort.descending,
            }
          : undefined,
      });
    },
  });

  protected readonly totalCount = computed(
    () => this.data.value()?.totalCount ?? 0,
  );
}
