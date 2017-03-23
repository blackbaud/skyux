import { Component, Input } from '@angular/core';

import { StacheLayout } from './layout';
import { InputConverter } from '../shared';

@Component({
  selector: 'stache-layout-default',
  templateUrl: './layout-default.component.html'
})
export class StacheLayoutDefaultComponent implements StacheLayout {
  @Input()
  public pageTitle;

  @Input()
  public breadcrumbsRoutes;

  @Input()
  public inPageRoutes;

  @Input()
  @InputConverter()
  public showBreadcrumbs: boolean;

  @Input()
  @InputConverter()
  public showTableOfContents: boolean;
}
