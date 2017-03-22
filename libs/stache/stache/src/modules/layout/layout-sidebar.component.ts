import { Component, Input, OnInit } from '@angular/core';

import { StacheLayout } from './layout';

@Component({
  selector: 'stache-layout-sidebar',
  templateUrl: './layout-sidebar.component.html'
})
export class StacheLayoutSidebarComponent implements StacheLayout, OnInit {
  @Input() public pageTitle;
  @Input() public breadcrumbsRoutes;
  @Input() public inPageRoutes;
  @Input() public showBreadcrumbs;
  @Input() public sidebarRoutes;

  public ngOnInit(): void {
    this.showBreadcrumbs = (this.showBreadcrumbs === true || this.showBreadcrumbs === 'true');
  }
}
