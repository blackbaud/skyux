import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { StacheLayout } from './layout';

@Component({
  selector: 'stache-layout',
  templateUrl: './layout.component.html'
})
export class StacheLayoutComponent implements OnInit, StacheLayout {
  @Input()
  public pageTitle;

  @Input()
  public layoutType = 'default';

  @Input()
  public inPageRoutes;

  @Input()
  public sidebarRoutes;

  @Input()
  public breadcrumbsRoutes;

  @Input()
  public showBreadcrumbs;

  public templateRef;

  @ViewChild('blank')
  private blankTemplateRef;

  @ViewChild('default')
  private defaultTemplateRef;

  @ViewChild('sidebar')
  private sidebarTemplateRef;

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
