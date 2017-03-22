import { Component, Input, OnInit } from '@angular/core';

import { StacheLayout } from './layout';

@Component({
  selector: 'stache-layout-default',
  templateUrl: './layout-default.component.html'
})
export class StacheLayoutDefaultComponent implements StacheLayout, OnInit {
  @Input() public pageTitle;
  @Input() public breadcrumbsRoutes;
  @Input() public inPageRoutes;
  @Input() public showBreadcrumbs;

  public ngOnInit(): void {
    this.showBreadcrumbs = (this.showBreadcrumbs === true || this.showBreadcrumbs === 'true');
  }
}
