import { Component, Input } from '@angular/core';

import { StacheLayout } from './layout';
import { InputConverter } from '../shared';
import { StacheNavLink } from '../nav';

@Component({
  selector: 'stache-layout-container',
  templateUrl: './layout-container.component.html'
})
export class StacheLayoutContainerComponent implements StacheLayout {
  @Input()
  public pageTitle: string;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public inPageRoutes: StacheNavLink[];

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
