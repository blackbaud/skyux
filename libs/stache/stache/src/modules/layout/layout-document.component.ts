import { Component, Input, AfterContentInit, ContentChildren } from '@angular/core';

import { StacheLayout } from './layout';
import { StachePageAnchorComponent } from '../page-anchor/page-anchor.component';

@Component({
  selector: 'stache-layout-document',
  templateUrl: './layout-document.component.html'
})
export class StacheLayoutDocumentComponent implements StacheLayout, AfterContentInit {
  @Input()
  public pageTitle: string;

  @Input()
  public routes;

  public inPageRoutes = [];

  @ContentChildren(StachePageAnchorComponent)
  private pageAnchors;

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
