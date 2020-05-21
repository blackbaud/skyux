import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

@Component({
  selector: 'app-vertical-tabs-docs',
  templateUrl: './vertical-tabs-docs.component.html'
})
export class VerticalTabDemoComponent {
  public groups: any[];
  public tabs: any[];
  public demoSettings: any = {};
  public count = 17;
  public otherCount = 4;

  public onTabsDemoReset(): void {
    this.tabs = [
      { tabHeading: 'Tab 1', content: 'Tab 1 content', tabHeaderCount: undefined, active: true },
      { tabHeading: 'Tab 2', content: 'Tab 2 content'},
      { tabHeading: 'Tab 3 (disabled)', content: 'Tab 3 content', disabled: true}
    ];
  }

  public onTabGroupsDemoReset(): void {
    this.demoSettings.contentTab1 = 'Group 1 — Tab 1 content';
    this.demoSettings.contentTab2 = 'Group 2 — Tab 1 content';
    this.groups = [
      {
        heading: 'Group 1',
        isOpen: true,
        isDisabled: false,
        subTabs: [
          { tabHeading: 'Group 1 — Tab 1', content:  'Group 1 — Tab 1 content', tabHeaderCount: undefined, active: true},
          { tabHeading: 'Group 1 — Tab 2', content: 'Group 1 — Tab 2 content' }]
      },
      {
        heading: 'Group 2',
        isOpen: false,
        isDisabled: false,
        subTabs: [
          { tabHeading: 'Group 2 — Tab 1', content: 'Group 2 — Tab 1 content',
            tabHeaderCount: undefined
          },
          { tabHeading: 'Group 2 — Tab 2',
            content:  'Group 2 — Tab 2 content'
          },
          { tabHeading: 'Group 2 — Tab 3 (disabled)',
          content: 'Group 2 — Tab 3 content',
          disabled: true
        }]
      },
      {
        heading: 'Group 3 (disabled)',
        isOpen: false,
        isDisabled: true,
        subTabs: []
      }
    ];
  }

  public onDemoSelectionChangeTabs(change: SkyDocsDemoControlPanelChange): void {
    this.demoSettings.contentTab1 = 'Tab 1 content';
    this.demoSettings.contentTab2 = 'Tab 2 content';

    if (change.counts) {
      this.demoSettings.count = this.count;
      this.demoSettings.otherCount = this.otherCount;
      this.demoSettings.contentTab1 = 'Tab 1 has ' + this.count + ' items.';
    } else {
      this.demoSettings.count = undefined;
      this.demoSettings.otherCount = undefined;
    }

    this.tabs = [
      { tabHeading: 'Tab 1', content: this.demoSettings.contentTab1, tabHeaderCount: this.demoSettings.count, active: true },
      { tabHeading: 'Tab 2', content: this.demoSettings.contentTab2},
      { tabHeading: 'Tab 3 (disabled)', content: 'Tab 3 content', disabled: true}
    ];
  }
  public onDemoSelectionChangeGroups(change: SkyDocsDemoControlPanelChange): void {
    this.demoSettings.contentTab1 = 'Group 1 — Tab 1 content';
    this.demoSettings.contentTab2 = 'Group 2 — Tab 1 content';
    if (change.counts) {
      this.demoSettings.contentTab1 = 'Group 1 — Tab 1 has ' + this.count + ' items.';
      this.demoSettings.contentTab2 = 'Group 2 — Tab 1 has ' + this.otherCount + ' items.';
      this.demoSettings.count = this.count;
      this.demoSettings.otherCount = this.otherCount;
    } else {
      this.demoSettings.count = undefined;
      this.demoSettings.otherCount = undefined;
    }

    this.groups = [
      {
        heading: 'Group 1',
        isOpen: true,
        isDisabled: false,
        subTabs: [
          { tabHeading: 'Group 1 — Tab 1', content:  this.demoSettings.contentTab1, tabHeaderCount: this.demoSettings.count, active: true},
          { tabHeading: 'Group 1 — Tab 2', content: 'Group 1 — Tab 2 content' }]
      },
      {
        heading: 'Group 2',
        isOpen: false,
        isDisabled: false,
        subTabs: [
          { tabHeading: 'Group 2 — Tab 1', content: this.demoSettings.contentTab2,
            tabHeaderCount: this.demoSettings.otherCount
          },
          { tabHeading: 'Group 2 — Tab 2',
            content:  'Group 2 — Tab 2 content'
          },
          { tabHeading: 'Group 2 — Tab 3 (disabled)',
          content: 'Group 2 — Tab 3 content',
          disabled: true
        }]
      },
      {
        heading: 'Group 3 (disabled)',
        isOpen: false,
        isDisabled: true,
        subTabs: []
      }
    ];
  }
}
