import { Component, Input, OnInit } from '@angular/core';

import {  StacheNavLink } from '../nav';
import { InputConverter } from '../shared';

@Component({
  selector: 'stache-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss']
})
export class StacheActionButtonsComponent implements OnInit {
  @Input()
  public routes: StacheNavLink[];

  @Input()
  @InputConverter()
  public showSearch: boolean = true;

  public filteredRoutes: StacheNavLink[];

  public searchText: string;

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
