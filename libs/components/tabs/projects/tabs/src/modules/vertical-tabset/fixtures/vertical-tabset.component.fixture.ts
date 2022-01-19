import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { SkyVerticalTabComponent } from '../vertical-tab.component';

import { SkyVerticalTabsetComponent } from '../vertical-tabset.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './vertical-tabset.component.fixture.html',
  styleUrls: ['./vertical-tabset.component.fixture.scss'],
})
export class VerticalTabsetTestComponent {
  public active: boolean = true;

  public group1Open: boolean = true;
  public group1Disabled: boolean = false;

  public group2Open: boolean = false;
  public group2Disabled: boolean = false;

  public group3Open: boolean = false;
  public group3Disabled: boolean = true;

  public maintainTabContent: boolean = false;

  public showScrollable: boolean = false;

  public tabDisabled: boolean = true;
  public tab1Required: boolean = false;

  @ViewChild(SkyVerticalTabsetComponent)
  public tabset: SkyVerticalTabsetComponent;

  @ViewChildren(SkyVerticalTabComponent)
  public verticalTabs: QueryList<SkyVerticalTabComponent>;
}
