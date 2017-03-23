import { Component, Input } from '@angular/core';

import { StacheLayout } from './layout';
import { InputConverter } from '../shared';
import { StacheNavLink } from '../nav/nav-link';

@Component({
  selector: 'stache-layout-default',
  templateUrl: './layout-default.component.html'
})
export class StacheLayoutDefaultComponent implements StacheLayout {
  @Input()
  public pageTitle: string;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public inPageRoutes: StacheNavLink[];

  @Input()
  @InputConverter()
  public showBreadcrumbs: boolean;

  @Input()
  @InputConverter()
  public showTableOfContents: boolean;
}
