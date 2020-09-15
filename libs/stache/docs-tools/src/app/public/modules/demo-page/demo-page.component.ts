import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  StacheNavLink
} from '@blackbaud/skyux-lib-stache';

import {
  SkyDocsCodeExamplesComponent
} from '../code-examples/code-examples.component';

import {
  SkyDocsDesignGuidelinesComponent
} from '../design-guidelines/design-guidelines.component';

import {
  SkyDocsSupportalService
} from '../shared/docs-tools-supportal.service';

import {
  SkyDocsComponentInfo
} from '../shared/docs-tools-component-info';

import {
  SkyDocsDemoPageDomAdapterService
} from './demo-page-dom-adapter.service';

import {
  SkyDocsDemoPageTitleService
} from './demo-page-title.service';

/**
 * The demo page component wraps all documentation components and handles the configuration and layout of the page.
 * @example
 * ```
 * <sky-docs-demo-page
 *   pageTitle="My demo page"
 * >
 *   Content here.
 * </sky-docs-demo-page>
 * ```
 */
@Component({
  selector: 'sky-docs-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss'],
  providers: [
    SkyDocsDemoPageDomAdapterService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageComponent implements OnInit, AfterContentInit, AfterViewInit {

  /**
   * Specifies the URL to the repo that stores the module's source code.
   * @required
   */
  @Input()
  public gitRepoUrl: string;

  /**
   * Specifies the TypeScript class name of the module. For example, `SkySampleModule`.
   * @required
   */
  @Input()
  public moduleName: string;

  /**
   * Specifies the local path to the module's source code. The value is relative to the root directory.
   */
  @Input()
  public moduleSourceCodePath: string;

  /**
   * Specifies the qualified name of the NPM package. For example, `@blackbaud/sample`.
   * @required
   */
  @Input()
  public packageName: string;

  /**
   * Specifies the URL to the NPM package.
   */
  @Input()
  public packageUrl: string;

  /**
   * Specifies the primary page heading.
   * @required
   */
  @Input()
  public pageTitle: string;

  /**
   * @internal
   */
  public enableCodeExamples = false;

  /**
   * @internal
   */
  public enableTabLayout = false;

  /**
   * @internal
   */
  public sidebarRoutes: StacheNavLink[];

  @ContentChild(SkyDocsDesignGuidelinesComponent)
  private designGuidelinesComponent: SkyDocsDesignGuidelinesComponent;

  @ContentChildren(SkyDocsCodeExamplesComponent)
  private codeExampleComponents: QueryList<SkyDocsCodeExamplesComponent>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private skyAppConfig: SkyAppConfig,
    private domAdapter: SkyDocsDemoPageDomAdapterService,
    private supportalService: SkyDocsSupportalService,
    private titleService: SkyDocsDemoPageTitleService
  ) { }

  public ngOnInit(): void {
    const currentHostUrl = this.skyAppConfig.skyux.host.url + '/' + this.skyAppConfig.skyux.name;
    this.updateTitle();

    this.supportalService
      .getComponentsInfo()
      .subscribe((results: SkyDocsComponentInfo[]) => {
        this.sidebarRoutes = [{
          name: 'Components',
          path: 'https://developer.blackbaud.com/skyux/components',
          children: results.map((component: SkyDocsComponentInfo) => ({
            name: component.name,
            path: this.getPath(component.url, currentHostUrl)
          }))
        }];
        this.changeDetector.markForCheck();
      });
  }

  public ngAfterContentInit(): void {
    this.enableCodeExamples = (this.codeExampleComponents.length > 0);
    this.enableTabLayout = !!(this.designGuidelinesComponent);
  }

  public ngAfterViewInit(): void {

    // Watch for route fragment to change and scroll to heading.
    this.activatedRoute.fragment.subscribe((fragment) => {
      this.domAdapter.scrollToFragment(fragment);
    });

    // Change the HREF attribute for all dynamic links when the query params change.
    // This will also generate the appropriate HREF if the user wants to open the link in a new window.
    this.activatedRoute.queryParams.subscribe(() => {
      this.domAdapter.setupAnchorLinks();
    });

    // When a dynamic link is clicked, use Angular's router so that everything works correctly.
    this.domAdapter.anchorLinkClick.subscribe((anchorLink: any) => {
      const fragment = anchorLink.href.split('#')[1];

      this.router.navigate([], {
        fragment,
        queryParamsHandling: 'merge'
      });

      if (this.activatedRoute.snapshot.fragment === fragment) {
        this.domAdapter.scrollToFragment(fragment);
      }
    });
  }

  private updateTitle(): void {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle, 'Components');
    }
  }

  private getPath(url: string, currentHostUrl: string): string {
    // Replace host + SPA so Stache will mark active.
    // Strip URL params is url is local, as those will be preserved by stacheRouterLink.
    if (url.indexOf(currentHostUrl) > -1) {
      return url.replace(currentHostUrl, '').split('?')[0];
    } else {
      return url;
    }
  }

}
