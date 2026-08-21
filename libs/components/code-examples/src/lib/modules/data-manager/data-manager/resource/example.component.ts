import {
  ChangeDetectionStrategy,
  Component,
  inject,
  resource,
} from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';

import { getServerPage } from './data';

/**
 * @title Data manager with a server-side resource data source
 */
@Component({
  selector: 'app-data-manager-resource-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataManagerModule],
  providers: [SkyDataManagerService, SkyUIConfigService],
})
export class DataManagerResourceExampleComponent {
  protected readonly dataManager = inject(SkyDataManagerService);

  protected readonly data = resource({
    params: () => this.dataManager.state(),
    loader: async ({ params }) => {
      // Simulates an asynchronous server request.
      await Promise.resolve();

      return getServerPage({
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 3,
        searchText: params.searchText,
        sort: params.activeSortOption
          ? {
              propertyName: params.activeSortOption.propertyName,
              descending: params.activeSortOption.descending,
            }
          : undefined,
      });
    },
  });

  protected get totalCount(): number {
    return this.data.value()?.totalCount ?? 0;
  }
}
