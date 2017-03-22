import { Component, OnInit, Input, AfterContentInit, ContentChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { StachePageAnchorComponent } from '../page-anchor/page-anchor.component';

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html'
})
export class StacheWrapperComponent implements OnInit, AfterContentInit {
  @Input() public pageTitle;
  @Input() public browserTitle = 'Browser Title';
  @Input() public layout = 'default';
  @Input() public sidebarRoutes = [];
  @Input() public breadcrumbsRoutes = [];
  @Input() public showBreadcrumbs: boolean = false;

  public inPageRoutes = [];

  @ContentChildren(StachePageAnchorComponent)
  private pageAnchors;

  public constructor(private titleService: Title) { }

  public ngOnInit(): void {
    this.titleService.setTitle(this.browserTitle);
  }

  public ngAfterContentInit(): void {
    this.pageAnchors.forEach(anchor => {
      this.inPageRoutes.push(anchor);
    });
  }
}
