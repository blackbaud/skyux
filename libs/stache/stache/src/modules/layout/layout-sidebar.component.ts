import { Component, Input } from '@angular/core';

import { StacheLayout } from './layout';
import { InputConverter } from '../shared';


@Component({
  selector: 'stache-layout-sidebar',
  templateUrl: './layout-sidebar.component.html'
})
export class StacheLayoutSidebarComponent implements StacheLayout {
  @Input()
  public pageTitle;

  @Input()
  public breadcrumbsRoutes;

  @Input()
  public inPageRoutes;

  @Input()
  public sidebarRoutes;

  @Input()
  @InputConverter()
  public showBreadcrumbs: boolean;
}
