import { Component, ViewChild, input } from '@angular/core';

import { SkySearchComponent } from '../search.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './search.component.fixture.html',
  standalone: false,
})
export class SearchTestComponent {
  @ViewChild(SkySearchComponent, {
    read: SkySearchComponent,
    static: false,
  })
  public searchComponent!: SkySearchComponent;

  public ariaLabel = input<string | undefined>(undefined);
  public ariaLabelledBy = input<string | undefined>(undefined);

  public disabled = input<boolean | undefined>(undefined);
  public debounceTime = input<number | undefined>(0);

  public searchText = input<string | undefined>(undefined);
  public placeholderText = input<string | undefined>(undefined);

  public expandMode = input<string | undefined>(undefined);

  public lastSearchTextApplied: string | undefined;
  public lastSearchTextChanged: string | undefined;

  public searchApplied(searchText: string): void {
    this.lastSearchTextApplied = searchText;
  }
  public searchChanged(searchText: string): void {
    this.lastSearchTextChanged = searchText;
  }
}
