import {
  HttpClient
} from '@angular/common/http';

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
  StacheNavLink
} from '@blackbaud/skyux-lib-stache';

import {
  SkyDocsCodeExamplesComponent
} from '../code-examples/code-examples.component';

import {
  SkyDocsDesignGuidelinesComponent
} from '../design-guidelines/design-guidelines.component';

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
   * @required
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

  private get anchorLinks(): NodeListOf<HTMLAnchorElement> {
    return document.querySelectorAll('a.sky-docs-anchor-link');
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router,
    private titleService: SkyDocsDemoPageTitleService
  ) { }

  public ngOnInit(): void {
    this.updateTitle();

    this.http.get('https://sky-pusa01.app.blackbaud.net/skysp/v1/docs/components-info')
      .subscribe((results: any) => {
        this.sidebarRoutes = [{
          name: 'Components',
          path: '/',
          children: results.components.map((component: any) => {
            return {
              name: component.name,
              path: component.url
            };
          })
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
      this.scrollToFragment(fragment);
    });

    // Change the HREF attribute for all dynamic links when the query params change.
    // This will also generate the appropriate HREF if the user wants to open the link in a new window.
    this.activatedRoute.queryParams.subscribe(() => {
      this.anchorLinks.forEach((anchor: HTMLAnchorElement) => {
        const fragment = anchor.href.split('#')[1];
        const url = window.location.href.split('#')[0];
        const href = `${url}#${fragment}`;
        anchor.href = href;
      });
    });

    // When a dynamic link is clicked, use Angular's router so that everything works correctly.
    // Wait for a tick to allow all anchors to be written.
    window.setTimeout(() => {
      this.anchorLinks.forEach((anchor: HTMLAnchorElement) => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();

          const fragment = anchor.href.split('#')[1];

          this.router.navigate([], {
            fragment,
            queryParamsHandling: 'merge'
          });

          if (this.activatedRoute.snapshot.fragment === fragment) {
            this.scrollToFragment(fragment);
          }
        });
      });
    });
  }

  private updateTitle(): void {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle, 'Components');
    }
  }

  private scrollToFragment(fragment: string): void {
    window.setTimeout(() => {
      const element = document.getElementById(fragment);
      if (element) {
        window.scrollTo(0, element.offsetTop);
      }
    }, 250);
  }

}
