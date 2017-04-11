/* tslint:disable:component-selector-name */
import { Component, OnInit, Input, AfterContentInit, ContentChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { StachePageAnchorComponent } from '../page-anchor/page-anchor.component';
import { StacheNavLink } from '../nav/nav-link';

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html'
})
export class StacheWrapperComponent implements OnInit, AfterContentInit {
  @Input()
  public pageTitle: string;

  @Input()
  public browserTitle: string;

  @Input()
  public layout = 'default';

  @Input()
  public actionButtonRoutes: StacheNavLink[] = [];

  @Input()
  public sidebarRoutes: StacheNavLink[] = [];

  @Input()
  public breadcrumbsRoutes: StacheNavLink[] = [];

  @Input()
  public showBreadcrumbs: boolean = false;

  @Input()
  public showTableOfContents: boolean = false;

  @Input()
  public showBackToTop: boolean = true;

  public inPageRoutes: StacheNavLink[] = [];

  @ContentChildren(StachePageAnchorComponent)
  private pageAnchors: any;

  public constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router) { }

  public ngOnInit(): void {
    if (this.browserTitle) {
      this.titleService.setTitle(this.browserTitle);
    }

    this.route.fragment.subscribe(fragment => {
      setImmediate(() => {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView();
        }
      });
    });
  }

  public ngAfterContentInit(): void {
    this.pageAnchors.forEach((anchor: StacheNavLink) => {
      this.inPageRoutes.push(anchor);
    });
  }
}
