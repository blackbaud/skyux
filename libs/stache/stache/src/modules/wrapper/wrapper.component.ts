import { Component, OnInit, Input, AfterContentInit, ContentChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { StachePageAnchorComponent } from '../page-anchor/page-anchor.component';

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html'
})
export class StacheWrapperComponent implements OnInit, AfterContentInit {
  @Input() public layout: string = 'default';
  @Input() public pageTitle: string;
  @Input() public documentTitle: string = 'Browser Title';
  @Input() public routes: any[] = [];
  public inPageRoutes: any[] = [];

  @ContentChildren(StachePageAnchorComponent) private pageAnchors;

  public constructor(private titleService: Title) {}

  public ngOnInit(): void {
    this.titleService.setTitle(this.documentTitle);
  }

  public ngAfterContentInit(): void {
    this.pageAnchors.forEach(h => {
      this.inPageRoutes.push({
        path: h.path,
        fragment: h.anchor,
        label: h.label
      });
    });
  }
}
