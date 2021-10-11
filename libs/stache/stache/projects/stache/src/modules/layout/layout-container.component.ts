import {
  Component,
  Input
} from '@angular/core';

import {
  StacheLayout
} from './layout';

import {
  booleanConverter,
  InputConverter
} from '../shared/input-converter';

import {
  StacheNavLink
} from '../nav/nav-link';

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
  @InputConverter(booleanConverter)
  public showBackToTop: boolean;

  @Input()
  @InputConverter(booleanConverter)
  public showBreadcrumbs: boolean;

  @Input()
  @InputConverter(booleanConverter)
  public showEditButton: boolean;

  @Input()
  @InputConverter(booleanConverter)
  public showTableOfContents: boolean;
}
