import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { StacheLayout } from './layout';

@Component({
  selector: 'stache-layout',
  templateUrl: './layout.component.html'
})
export class StacheLayoutComponent implements OnInit, StacheLayout {
  @Input() public pageTitle: string;
  @Input() public routes;
  @Input() public layoutType: string = 'default';
  @Input() public inPageRoutes;

  public templateRef;

  @ViewChild('default') private defaultTemplateRef;
  @ViewChild('sidebar') private sidebarTemplateRef;
  @ViewChild('document') private documentTemplateRef;

  public ngOnInit(): void {
    switch (this.layoutType) {
      case 'sidebar':
        this.templateRef = this.sidebarTemplateRef;
        break;
      case 'document':
        this.templateRef = this.documentTemplateRef;
        break;
      default:
        this.templateRef = this.defaultTemplateRef;
        break;
    }
  }
}
