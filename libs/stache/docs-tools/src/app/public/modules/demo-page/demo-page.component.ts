import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList
} from '@angular/core';

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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'sky-docs-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageComponent implements OnInit, AfterContentInit, AfterViewInit {

  @Input()
  public gitRepoUrl: string;

  @Input()
  public moduleName: string;

  @Input()
  public packageName: string;

  @Input()
  public pageTitle: string;

  @Input()
  public sourceCodeLocation: string;

  public enableCodeExamples = false;
  public enableTabLayout = false;
  public sidebarRoutes: StacheNavLink[];

  @ContentChild(SkyDocsDesignGuidelinesComponent)
  private designGuidelinesComponent: SkyDocsDesignGuidelinesComponent;

  @ContentChildren(SkyDocsCodeExamplesComponent)
  private codeExampleComponents: QueryList<SkyDocsCodeExamplesComponent>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: SkyDocsDemoPageTitleService
  ) { }

  public ngOnInit(): void {
    this.updateTitle();

    const baseUrl = 'https://developer.blackbaud.com/skyux/components';

    this.sidebarRoutes = [{
      name: 'Components',
      path: '/',
      children: [
        {
          name: 'Action button',
          path: `${baseUrl}/action-button`
        },
        {
          name: 'Alert',
          path: `${baseUrl}/alert`
        },
        {
          name: 'Autocomplete',
          path: `${baseUrl}/autocomplete`
        },
        {
          name: 'Avatar',
          path: `${baseUrl}/avatar`
        },
        {
          name: 'Button',
          path: `${baseUrl}/button`
        },
        {
          name: 'Card',
          path: `${baseUrl}/card`
        },
        {
          name: 'Checkbox',
          path: `${baseUrl}/checkbox`
        },
        {
          name: 'Code block',
          path: `${baseUrl}/code-block`
        },
        {
          name: 'Colorpicker',
          path: `${baseUrl}/colorpicker`
        },
        {
          name: 'Confirm',
          path: `${baseUrl}/confirm`
        },
        {
          name: 'Copy to clipboard',
          path: `${baseUrl}/copy-to-clipboard`
        },
        {
          name: 'Datepicker',
          path: `${baseUrl}/datepicker`
        },
        {
          name: 'Date range picker',
          path: `${baseUrl}/date-range-picker`
        },
        {
          name: 'Definition list',
          path: `${baseUrl}/definition-list`
        },
        {
          name: 'Dropdown',
          path: `${baseUrl}/dropdown`
        },
        {
          name: 'Email validation',
          path: `${baseUrl}/email-validation`
        },
        {
          name: 'Error',
          path: `${baseUrl}/error`
        },
        {
          name: 'File attachment',
          path: `${baseUrl}/fileattachments`
        },
        {
          name: 'Filter',
          path: `${baseUrl}/filter`
        },
        {
          name: 'Fluid grid',
          path: `${baseUrl}/fluid-grid`
        },
        {
          name: 'Flyout',
          path: `${baseUrl}/flyout`
        },
        {
          name: 'Form',
          path: `${baseUrl}/form`
        },
        {
          name: 'Grid',
          path: `${baseUrl}/grid`
        },
        {
          name: 'Help inline',
          path: `${baseUrl}/help-inline`
        },
        {
          name: 'Highlight',
          path: `${baseUrl}/text-highlight`
        },
        {
          name: 'Icon',
          path: `${baseUrl}/icon`
        },
        {
          name: 'Infinite scroll',
          path: `${baseUrl}/infinite-scroll`
        },
        {
          name: 'Inline form',
          path: `${baseUrl}/inline-form`
        },
        {
          name: 'Key info',
          path: `${baseUrl}/key-info`
        },
        {
          name: 'Label',
          path: `${baseUrl}/label`
        },
        {
          name: 'Link records',
          path: `${baseUrl}/link-records`
        },
        {
          name: 'List',
          path: `${baseUrl}/list`
        },
        {
          name: 'Lookup',
          path: `${baseUrl}/lookup`
        },
        {
          name: 'Media queries',
          path: `${baseUrl}/media-queries`
        },
        {
          name: 'Modal',
          path: `${baseUrl}/modal`
        },
        {
          name: 'Navbar',
          path: `${baseUrl}/navbar`
        },
        {
          name: 'Numeric',
          path: `${baseUrl}/numeric`
        },
        {
          name: 'Page summary',
          path: `${baseUrl}/page-summary`
        },
        {
          name: 'Paging',
          path: `${baseUrl}/paging`
        },
        {
          name: 'Popover',
          path: `${baseUrl}/popover`
        },
        {
          name: 'Progress indicator',
          path: `${baseUrl}/progress-indicator`
        },
        {
          name: 'Radio button',
          path: `${baseUrl}/radio`
        },
        {
          name: 'Repeater',
          path: `${baseUrl}/repeater`
        },
        {
          name: 'Search',
          path: `${baseUrl}/search`
        },
        {
          name: 'Sectioned form',
          path: `${baseUrl}/sectioned-form`
        },
        {
          name: 'Select field',
          path: `${baseUrl}/select-field`
        },
        {
          name: 'Sort',
          path: `${baseUrl}/sort`
        },
        {
          name: 'Status indicator',
          path: `${baseUrl}/status-indicator`
        },
        {
          name: 'Summary action bar',
          path: `${baseUrl}/summary-actionbar`
        },
        {
          name: 'Tabs',
          path: `${baseUrl}/tabs`
        },
        {
          name: 'Text expand',
          path: `${baseUrl}/text-expand`
        },
        {
          name: 'Text expand repeater',
          path: `${baseUrl}/text-expand-repeater`
        },
        {
          name: 'Tile',
          path: `${baseUrl}/tile`
        },
        {
          name: 'Timepicker',
          path: `${baseUrl}/timepicker`
        },
        {
          name: 'Toast',
          path: `${baseUrl}/toast`
        },
        {
          name: 'Tokens',
          path: `${baseUrl}/tokens`
        },
        {
          name: 'Toolbar',
          path: `${baseUrl}/toolbar`
        },
        {
          name: 'URL validation',
          path: `${baseUrl}/url-validation`
        },
        {
          name: 'Vertical tabs',
          path: `${baseUrl}/vertical-tabs`
        },
        {
          name: 'Wait',
          path: `${baseUrl}/wait`
        },
        {
          name: 'Wizard',
          path: `${baseUrl}/wizard`
        }
      ]
    }];
  }

  public ngAfterContentInit(): void {
    this.enableCodeExamples = (this.codeExampleComponents.length > 0);
    this.enableTabLayout = !!(this.designGuidelinesComponent);
  }

  public ngAfterViewInit(): void {
    // Watch for route fragment to change and scroll to heading.
    this.activatedRoute.fragment.subscribe((fragment) => {
      window.setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          window.scrollTo(0, element.offsetTop);
        }
      }, 250);
    });
  }

  private updateTitle(): void {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle, 'Components');
    }
  }

}
