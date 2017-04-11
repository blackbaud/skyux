import { Component, Input } from '@angular/core';
import { StacheNavLink } from '../nav/nav-link';
import { StacheNavComponent } from '../nav/nav.component';
import { StacheLayout } from './layout';
import { InputConverter } from '../shared';

@Component({
  selector: 'stache-layout-action-buttons',
  templateUrl: './layout-action-buttons.component.html',
  styleUrls: ['./layout-action-buttons.component.scss']
})
export class StacheLayoutActionButtonsComponent extends StacheNavComponent implements StacheLayout {
  @Input()
  public pageTitle: string;

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public inPageRoutes: StacheNavLink[];

  @Input()
  public actionButtonRoutes: StacheNavLink[];

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
