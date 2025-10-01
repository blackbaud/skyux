import { Component, inject, model } from '@angular/core';
import {
  SkyFilterBarFilterItem,
  SkyFilterBarModule,
  SkyFilterItemLookupSearchAsyncArgs,
} from '@skyux/filter-bar';

import { ExampleService } from './example.service';

/**
 * @title Filter bar with lookup filter example
 */
@Component({
  selector: 'app-filter-bar-lookup-example',
  imports: [SkyFilterBarModule],
  templateUrl: './example.component.html',
})
export class FilterBarLookupExampleComponent {
  protected readonly appliedFilters = model<
    SkyFilterBarFilterItem[] | undefined
  >();

  readonly #svc = inject(ExampleService);

  protected onSearchAsync(args: SkyFilterItemLookupSearchAsyncArgs): void {
    // In a real-world application the search service might return an Observable
    // created by calling HttpClient.get(). Assigning that Observable to the result
    // allows the lookup component to cancel the web request if it does not complete
    // before the user searches again.
    args.result = this.#svc.search(args.searchText);
  }
}
