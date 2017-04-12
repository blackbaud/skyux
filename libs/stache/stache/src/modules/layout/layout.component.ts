import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { StacheLayout } from './layout';
import { StacheNavLink } from '../nav/nav-link';

@Component({
  selector: 'stache-layout',
  templateUrl: './layout.component.html'
})
export class StacheLayoutComponent implements OnInit, StacheLayout {
  @Input()
  public pageTitle: string;

  @Input()
  public layoutType = 'default';

  @Input()
  public inPageRoutes: StacheNavLink[];

  @Input()
  public showTableOfContents: boolean;

  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public showBreadcrumbs: boolean;

  @Input()
  public showBackToTop: boolean;

  public templateRef: any;

  @ViewChild('blankLayout')
  private blankTemplateRef: any;

  @ViewChild('defaultLayout')
  private defaultTemplateRef: any;

  @ViewChild('sidebarLayout')
  private sidebarTemplateRef: any;

  public ngOnInit(): void {
    switch (this.layoutType) {
      case 'blank':
        this.templateRef = this.blankTemplateRef;
        break;
      case 'sidebar':
        this.templateRef = this.sidebarTemplateRef;
        break;
      default:
        this.templateRef = this.defaultTemplateRef;
        break;
    }
  }
}
