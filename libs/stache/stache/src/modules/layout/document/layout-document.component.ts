import { Component, AfterContentInit, ViewChild, ContentChildren, ElementRef, AfterViewInit, ViewChildren, AfterViewChecked, ViewContainerRef, OnInit } from '@angular/core';

import { StacheLayoutComponent } from '../layout.component';
import { StachePageAnchorComponent } from '../../page-anchor/page-anchor.component';

@Component({
  selector: 'stache-layout-document',
  templateUrl: './layout-document.component.html'
})
export class StacheLayoutDocumentComponent extends StacheLayoutComponent implements AfterContentInit {
  public routes: any[] = [];
  public inPageRoutes: any[] = [];

  @ContentChildren(StachePageAnchorComponent)
  private pageAnchors;

  public constructor(private elementRef: ElementRef) {
    super();
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
