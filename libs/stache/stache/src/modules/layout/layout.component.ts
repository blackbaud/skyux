import { StacheNavLink } from '../nav/nav-link';
import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { StacheLayout } from './layout';

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

  public templateRef: any;

  @ViewChild('blank')
  private blankTemplateRef: any;

  @ViewChild('default')
  private defaultTemplateRef: any;

  @ViewChild('sidebar')
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
