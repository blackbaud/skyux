import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  ListStateDispatcher
} from '../list/state';

import {
  ListToolbarItemModel
} from '../list/state';

@Component({
  selector: 'sky-list-filter-button',
  templateUrl: './list-filter-button.component.html'
})
export class SkyListFilterButtonComponent implements AfterViewInit {
  @ViewChild('filterButton')
  private filterButtonTemplate: TemplateRef<any>;

  constructor(
    private dispatcher: ListStateDispatcher
  ) { }

  public ngAfterViewInit() {
    this.dispatcher.toolbarAddItems(
      [
        new ListToolbarItemModel({
          template: this.filterButtonTemplate,
          location: 'left'
        })
      ],
      1
    );
  }
}
