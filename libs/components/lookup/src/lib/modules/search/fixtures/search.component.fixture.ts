import { Component, ViewChild } from '@angular/core';

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

  public ariaLabel: string | undefined;
  public ariaLabelledBy: string | undefined;

  public disabled: boolean | undefined;
  public debounceTime: number | undefined = 0;

  public searchText: string | undefined;
  public placeholderText: string | undefined;

  public expandMode: string | undefined;

  public lastSearchTextApplied: string | undefined;
  public lastSearchTextChanged: string | undefined;

  public searchApplied(searchText: string): void {
    this.lastSearchTextApplied = searchText;
  }
  public searchChanged(searchText: string): void {
    this.lastSearchTextChanged = searchText;
  }
}
