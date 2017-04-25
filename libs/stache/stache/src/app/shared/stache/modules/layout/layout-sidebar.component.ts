import { StacheNavLink } from '../nav/nav-link';
import { Component, Input } from '@angular/core';

import { StacheLayout } from './layout';
import { InputConverter } from '../shared';

@Component({
  selector: 'stache-layout-sidebar',
  templateUrl: './layout-sidebar.component.html'
})
export class StacheLayoutSidebarComponent implements StacheLayout {
  @Input()
  public pageTitle: string;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public inPageRoutes: StacheNavLink[];

  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Input()
  @InputConverter()
  public showBackToTop: boolean;

  @Input()
  @InputConverter()
  public showBreadcrumbs: boolean;

  @Input()
  @InputConverter()
  public showTableOfContents: boolean;

}
