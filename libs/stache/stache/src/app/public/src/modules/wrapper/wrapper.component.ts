/* tslint:disable:component-selector */
import {
  Component, OnInit, OnDestroy, Input, AfterContentInit, AfterViewInit, ContentChildren, QueryList
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { StacheTitleService } from './title.service';
import { StachePageAnchorComponent } from '../page-anchor';
import { StacheJsonDataService } from '../shared';
import { StacheNavLink, StacheNavService } from '../nav';

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class StacheWrapperComponent implements OnInit, AfterContentInit, OnDestroy, AfterViewInit {
  @Input()
  public pageTitle: string;

  @Input()
  public windowTitle: string;

  @Input()
  public navTitle: string;

  @Input()
  public layout = 'sidebar';

  @Input()
  public sidebarRoutes: StacheNavLink[];

  @Input()
  public breadcrumbsRoutes: StacheNavLink[];

  @Input()
  public showBreadcrumbs: boolean = true;

  @Input()
  public showTableOfContents: boolean = false;

  @Input()
  public showBackToTop: boolean = true;

  public jsonData: any;
  public inPageRoutes: StacheNavLink[] = [];

  @ContentChildren(StachePageAnchorComponent)
  private pageAnchors: QueryList<StachePageAnchorComponent>;
  private pageAnchorSubscriptions: Subscription[] = [];

  public constructor(
    private dataService: StacheJsonDataService,
    private titleService: StacheTitleService,
    private route: ActivatedRoute,
    private navService: StacheNavService) { }

  public ngOnInit(): void {
    this.titleService.setTitle(this.windowTitle || this.pageTitle);
    this.jsonData = this.dataService.getAll();
  }

  public ngAfterContentInit(): void {
    this.registerPageAnchors();
  }

  public ngAfterViewInit() {
    this.checkRouteHash();
  }

  public ngOnDestroy(): void {
    this.destroyPageAnchorSubscriptions();
  }

  private registerPageAnchors(): void {
    this.inPageRoutes = [];
    this.destroyPageAnchorSubscriptions();

    // Save each subscription so we can unsubscribe after the component is destroyed.
    this.pageAnchorSubscriptions = this.pageAnchors.map(
      (anchor: StachePageAnchorComponent, index: number) => {

        // First, create a placeholder for the route, until it's processed.
        this.inPageRoutes.push({ name: '', path: '' });

        // This will allow the wrapper to subscribe to each Page Anchor's changes.
        return anchor.navLinkStream
          .subscribe((link: StacheNavLink) => {
            this.inPageRoutes[index] = link;
          });
      }
    );
  }

  private checkRouteHash(): void {
    this.route.fragment
      .subscribe((fragment: string) => {
        let url = '';
        this.route.url.subscribe(segments => url = segments.join('/')).unsubscribe();
        if (fragment) {
          this.navService.navigate({path: url, fragment});
        }
      })
      .unsubscribe();
  }

  private destroyPageAnchorSubscriptions(): void {
    this.pageAnchorSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.pageAnchorSubscriptions = [];
  }
}
