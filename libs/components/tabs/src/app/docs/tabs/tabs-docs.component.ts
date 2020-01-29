// tslint:disable:member-ordering
import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

@Component({
  selector: 'app-tabs-docs',
  templateUrl: './tabs-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsDocsComponent {

  public demoSettings: any = {};

  public includeCounts: boolean;

  public initialTabArray = [
    {
      tabHeading: 'Tab 1',
      tabContent: 'Content for Tab 1',
      tabHeaderCount: 99,
      tabClosable: true
    },
    {
      tabHeading: 'Tab 2',
      tabContent: 'Content for Tab 2',
      tabHeaderCount: 99,
      tabClosable: true
    },
    {
      tabHeading: 'Tab 3',
      tabContent: 'Content for Tab 3',
      tabClosable: false
    }
  ];

  public tabArray = this.initialTabArray.slice();

  private tabCounter: number = this.tabArray.length;

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.includeCounts === true) {
      this.demoSettings.showCounts = true;
    } else if (change.includeCounts === false) {
      this.demoSettings.showCounts = false;
    }

    if (change.includeAddAndClose === true) {
      this.demoSettings.includeAddAndClose = true;
    } else if (change.includeAddAndClose === false) {
      this.demoSettings.includeAddAndClose = false;
    }
  }

  public onNewTabClick(): void {
    this.tabCounter++;

    this.tabArray.push({
      tabHeading: 'Tab ' + this.tabCounter,
      tabContent: 'Content for Tab ' + this.tabCounter,
      tabHeaderCount: 99,
      tabClosable: true
    });
  }

  public onCloseClick(arrayIndex: number): void {
    this.tabArray.splice(arrayIndex, 1);
  }

  public onResetClick(): void {
    this.tabArray = this.initialTabArray.slice();
    this.tabCounter = this.tabArray.length;
  }
}
