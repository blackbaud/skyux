import { Component } from '@angular/core';

@Component({
  selector: 'sky-page-header-fixtures',
  templateUrl: './page-header-fixtures.component.html'
})
export class PageHeaderFixturesComponent {
  public spokeTitle = 'Page Title';
  public hubLink = {
    label: 'Parent Link',
    permalink: {
      url: '#'
    }
  };
}
