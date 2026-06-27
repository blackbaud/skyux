import { Component } from '@angular/core';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';

import { Item } from './item';

/**
 * @title Search with basic setup
 */
@Component({
  selector: 'app-lookup-search-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyRepeaterModule, SkySearchModule, SkyToolbarModule],
})
export class LookupSearchBasicExampleComponent {
  protected displayedItems: Item[];

  private items: Item[] = [
    {
      title: 'Call Robert Hernandez',
      note: 'Robert recently gave a very generous gift. We should call to thank him.',
    },
    {
      title: 'Send invitation to ball',
      note: "The Spring Ball is coming up soon. Let's get those invitations out!",
    },
    {
      title: 'Clean up desk',
      note: 'File and organize papers.',
    },
    {
      title: 'Investigate leads',
      note: 'Check out leads for important charity event funding.',
    },
    {
      title: 'Send thank you note',
      note: 'Send a thank you note to Timothy for his donation.',
    },
  ];

  protected placeholderText = 'Search through reminders.';
  protected searchAriaLabel = 'Search reminders';
  protected searchText = '';

  constructor() {
    this.displayedItems = this.items;
  }

  protected searchApplied(searchText: string): void {
    let filteredItems = this.items;
    this.searchText = searchText;

    if (searchText) {
      filteredItems = this.items.filter((item: Item) => {
        let property: keyof typeof item;

        for (property in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, property) &&
            (property === 'title' || property === 'note')
          ) {
            if (item[property].includes(searchText)) {
              return true;
            }
          }
        }

        return false;
      });
    }

    this.displayedItems = filteredItems;
  }
}
