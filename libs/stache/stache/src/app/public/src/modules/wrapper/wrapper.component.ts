/* tslint:disable:component-selector */
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StacheTitleService } from './title.service';
import { StacheConfigService, StacheJsonDataService, StacheOmnibarAdapterService, StacheWindowRef } from '../shared';
import { StacheNavLink, StacheNavService } from '../nav';
import { StachePageAnchorService } from '../page-anchor/page-anchor.service';

const _get = require('lodash.get');

@Component({
  selector: 'stache',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class StacheWrapperComponent implements OnInit, OnDestroy, AfterViewInit {
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
  public showEditButton: boolean = this.checkEditButtonUrl();

  @Input()
  public showTableOfContents: boolean = false;

  @Input()
  public showBackToTop: boolean = true;

  public jsonData: any;
  public inPageRoutes: StacheNavLink[] = [];
  private pageAnchorSubscription: Subscription;

  public constructor(
    private config: StacheConfigService,
    private dataService: StacheJsonDataService,
    private titleService: StacheTitleService,
    private route: ActivatedRoute,
    private navService: StacheNavService,
    private anchorService: StachePageAnchorService,
    private cdr: ChangeDetectorRef,
    private windowRef: StacheWindowRef,
    private omnibarService: StacheOmnibarAdapterService) { }

  public ngOnInit(): void {
    this.omnibarService.checkForOmnibar();
    this.jsonData = this.dataService.getAll();
    this.registerPageAnchors();
  }

  public ngAfterViewInit() {
    const preferredDocumentTitle = this.getPreferredDocumentTitle();
    this.titleService.setTitle(preferredDocumentTitle);
    this.checkRouteHash();
    this.cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.destroyPageAnchorSubscription();
  }

  private getPreferredDocumentTitle(): string {
    return this.windowTitle || this.pageTitle || this.navTitle || this.getTutorialHeader();
  }

  private getTutorialHeader(): string {
    const currentTutorialHeader = this.windowRef.nativeWindow.document.querySelector(`.stache-tutorial-heading`);
    if (currentTutorialHeader && currentTutorialHeader.textContent) {
      return currentTutorialHeader.textContent.trim();
    }
  }

  private registerPageAnchors(): void {
    this.inPageRoutes = [];
    this.destroyPageAnchorSubscription();
    this.pageAnchorSubscription = this.anchorService.anchorStream.subscribe(
      link => {
        if (link.order !== undefined) {
          this.inPageRoutes.splice(link.order, 0, link);
        } else {
          this.inPageRoutes.push(link);
        }
      }
    );
  }

  private checkEditButtonUrl(): boolean {
    const url = _get(this.config, 'skyux.appSettings.stache.editButton.url');
    return url !== undefined;
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

  private destroyPageAnchorSubscription(): void {
    if (this.pageAnchorSubscription) {
      this.pageAnchorSubscription.unsubscribe();
      this.pageAnchorSubscription = undefined;
    }
  }
}
