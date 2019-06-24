import {
  AfterContentInit,
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
  SkyDocsDemoComponent
} from '../demo/demo.component';

import {
  SkyDocsDesignGuidelinesComponent
} from '../design-guidelines/design-guidelines.component';

import {
  SkyDocsDemoPageTitleService
} from './demo-page-title.service';

@Component({
  selector: 'sky-docs-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageComponent implements OnInit, AfterContentInit {

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
  public enableDemo = false;
  public enableTabLayout = false;
  public sidebarRoutes: StacheNavLink[];

  @ContentChild(SkyDocsDesignGuidelinesComponent)
  private designGuidelinesComponent: SkyDocsDesignGuidelinesComponent;

  @ContentChildren(SkyDocsDemoComponent)
  private demoComponents: QueryList<SkyDocsDemoComponent>;

  @ContentChildren(SkyDocsCodeExamplesComponent)
  private codeExampleComponents: QueryList<SkyDocsCodeExamplesComponent>;

  constructor(
    private titleService: SkyDocsDemoPageTitleService
  ) { }

  public ngOnInit(): void {
    this.updateTitle();

    const urlRoot = 'https://developer.blackbaud.com/skyux/components';

    this.sidebarRoutes = [{
      name: 'Components',
      path: '/',
      children: [
        {
          name: 'Action button',
          path: `${urlRoot}/action-button`
        },
        {
          name: 'Alert',
          path: `${urlRoot}/alert`
        },
        {
          name: 'Autocomplete',
          path: `${urlRoot}/autocomplete`
        },
        {
          name: 'Avatar',
          path: `${urlRoot}/avatar`
        },
        {
          name: 'Button',
          path: `${urlRoot}/button`
        },
        {
          name: 'Card',
          path: `${urlRoot}/card`
        },
        {
          name: 'Checkbox',
          path: `${urlRoot}/checkbox`
        },
        {
          name: 'Code block',
          path: `${urlRoot}/code-block`
        },
        {
          name: 'Colorpicker',
          path: `${urlRoot}/colorpicker`
        },
        {
          name: 'Confirm',
          path: `${urlRoot}/confirm`
        },
        {
          name: 'Copy to clipboard',
          path: `${urlRoot}/copy-to-clipboard`
        },
        {
          name: 'Datepicker',
          path: `${urlRoot}/datepicker`
        },
        {
          name: 'Date range picker',
          path: `${urlRoot}/date-range-picker`
        },
        {
          name: 'Definition list',
          path: `${urlRoot}/definition-list`
        },
        {
          name: 'Dropdown',
          path: `${urlRoot}/dropdown`
        },
        {
          name: 'Email validation',
          path: `${urlRoot}/email-validation`
        },
        {
          name: 'Error',
          path: `${urlRoot}/error`
        },
        {
          name: 'File attachment',
          path: `${urlRoot}/fileattachments`
        },
        {
          name: 'Filter',
          path: `${urlRoot}/filter`
        },
        {
          name: 'Fluid grid',
          path: `${urlRoot}/fluid-grid`
        },
        {
          name: 'Flyout',
          path: `${urlRoot}/flyout`
        },
        {
          name: 'Form',
          path: `${urlRoot}/form`
        },
        {
          name: 'Grid',
          path: `${urlRoot}/grid`
        },
        {
          name: 'Help inline',
          path: `${urlRoot}/help-inline`
        },
        {
          name: 'Highlight',
          path: `${urlRoot}/text-highlight`
        },
        {
          name: 'Icon',
          path: `${urlRoot}/icon`
        },
        {
          name: 'Infinite scroll',
          path: `${urlRoot}/infinite-scroll`
        },
        {
          name: 'Inline form',
          path: `${urlRoot}/inline-form`
        },
        {
          name: 'Key info',
          path: `${urlRoot}/key-info`
        },
        {
          name: 'Label',
          path: `${urlRoot}/label`
        },
        {
          name: 'Link records',
          path: `${urlRoot}/link-records`
        },
        {
          name: 'List',
          path: `${urlRoot}/list`
        },
        {
          name: 'Lookup',
          path: `${urlRoot}/lookup`
        },
        {
          name: 'Media queries',
          path: `${urlRoot}/media-queries`
        },
        {
          name: 'Modal',
          path: `${urlRoot}/modal`
        },
        {
          name: 'Navbar',
          path: `${urlRoot}/navbar`
        },
        {
          name: 'Numeric',
          path: `${urlRoot}/numeric`
        },
        {
          name: 'Page summary',
          path: `${urlRoot}/page-summary`
        },
        {
          name: 'Paging',
          path: `${urlRoot}/paging`
        },
        {
          name: 'Popover',
          path: `${urlRoot}/popover`
        },
        {
          name: 'Progress indicator',
          path: `${urlRoot}/progress-indicator`
        },
        {
          name: 'Radio button',
          path: `${urlRoot}/radio`
        },
        {
          name: 'Repeater',
          path: `${urlRoot}/repeater`
        },
        {
          name: 'Search',
          path: `${urlRoot}/search`
        },
        {
          name: 'Sectioned form',
          path: `${urlRoot}/sectioned-form`
        },
        {
          name: 'Select field',
          path: `${urlRoot}/select-field`
        },
        {
          name: 'Sort',
          path: `${urlRoot}/sort`
        },
        {
          name: 'Status indicator',
          path: `${urlRoot}/status-indicator`
        },
        {
          name: 'Summary action bar',
          path: `${urlRoot}/summary-actionbar`
        },
        {
          name: 'Tabs',
          path: `${urlRoot}/tabs`
        },
        {
          name: 'Text expand',
          path: `${urlRoot}/text-expand`
        },
        {
          name: 'Text expand repeater',
          path: `${urlRoot}/text-expand-repeater`
        },
        {
          name: 'Tile',
          path: `${urlRoot}/tile`
        },
        {
          name: 'Timepicker',
          path: `${urlRoot}/timepicker`
        },
        {
          name: 'Toast',
          path: `${urlRoot}/toast`
        },
        {
          name: 'Tokens',
          path: `${urlRoot}/tokens`
        },
        {
          name: 'Toolbar',
          path: `${urlRoot}/toolbar`
        },
        {
          name: 'URL validation',
          path: `${urlRoot}/url-validation`
        },
        {
          name: 'Vertical tabs',
          path: `${urlRoot}/vertical-tabs`
        },
        {
          name: 'Wait',
          path: `${urlRoot}/wait`
        },
        {
          name: 'Wizard',
          path: `${urlRoot}/wizard`
        }
      ]
    }];
  }

  public ngAfterContentInit(): void {
    this.enableCodeExamples = (this.codeExampleComponents.length > 0);
    this.enableDemo = (this.demoComponents.length > 0);
    this.enableTabLayout = !!(this.designGuidelinesComponent);
  }

  private updateTitle(): void {
    if (this.pageTitle) {
      this.titleService.setTitle(this.pageTitle, 'Components');
    }
  }

}
