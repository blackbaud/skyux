import { Component, Input, OnInit } from '@angular/core';

import { StacheNavLink } from '../nav/nav-link';

import {
  booleanConverter,
  InputConverter
} from '../shared/input-converter';

@Component({
  selector: 'stache-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss']
})
export class StacheActionButtonsComponent implements OnInit {
  @Input()
  public set routes(value: StacheNavLink[]) {
    this._routes = value;
    this.filteredRoutes = this.routes;
  }

  public get routes(): StacheNavLink[] {
    return this._routes || [];
  }

  @Input()
  @InputConverter(booleanConverter)
  public showSearch = true;

  public filteredRoutes: StacheNavLink[];

  public searchText: string;

  private _routes: StacheNavLink[];

  private searchKeys: string[] = ['name', 'summary'];

  public constructor() { }

  public ngOnInit() {
    this.filteredRoutes = this.routes;
  }

  public onKeyUp(event: KeyboardEvent) {
    const searchText = (event.target as HTMLInputElement).value;
    this.searchApplied(searchText);
  }

  public searchApplied(searchText: string) {
    this.searchText = searchText;
    this.filteredRoutes = this.routes;
    const query = searchText.toLowerCase();

    if (!searchText) {
      return;
    }
    this.filteredRoutes = this.routes.filter((route: any) => {
      const matchingFields = this.searchKeys.filter(key => {
        const isMatch = (route[key] && route[key].toLowerCase().includes(query));
        return isMatch;
      });
      return (matchingFields.length > 0);
    });
  }
}
