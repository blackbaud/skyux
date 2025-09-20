import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { SkyVerticalTabComponent } from '../vertical-tab.component';
import { SkyVerticalTabsetComponent } from '../vertical-tabset.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './vertical-tabset.component.fixture.html',
  styleUrls: ['./vertical-tabset.component.fixture.scss'],
  standalone: false,
})
export class VerticalTabsetTestComponent {
  public active: boolean | undefined = true;

  public group1Open = true;
  public group1Disabled = false;

  public group2Open = false;
  public group2Disabled = false;

  public group3Open = false;
  public group3Disabled = true;

  public maintainTabContent = false;

  public showScrollable = false;

  public tabDisabled = true;
  public tab1AriaRole: string | undefined = 'tab';
  public tab1Id: string | undefined = 'some-tab';
  public tab1Required = false;
  public tabsetAriaRole: string | undefined = 'tablist';

  @ViewChild(SkyVerticalTabsetComponent)
  public tabset: SkyVerticalTabsetComponent | undefined;

  @ViewChildren(SkyVerticalTabComponent)
  public verticalTabs: QueryList<SkyVerticalTabComponent> | undefined;
}
