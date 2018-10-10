import { Component, ViewChild } from '@angular/core';
import { SkyVerticalTabComponent } from './../vertical-tab.component';
import { SkyVerticalTabsetComponent } from './../vertical-tabset.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './vertical-tabset.component.fixture.html',
  styleUrls: ['./vertical-tabset.component.fixture.scss']
})
export class VerticalTabsetTestComponent {
  public group1Open: boolean = true;
  public group1Disabled: boolean = false;

  public group2Open: boolean = false;
  public group2Disabled: boolean = false;

  public group3Open: boolean = false;
  public group3Disabled: boolean = true;

  public active: boolean = true;
  public tabDisabled: boolean = true;

  @ViewChild(SkyVerticalTabsetComponent)
  public tabset: SkyVerticalTabsetComponent;

  @ViewChild(SkyVerticalTabComponent)
  public verticalTabs: SkyVerticalTabComponent;
}
