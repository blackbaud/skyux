import { Component, ViewChild, input, model } from '@angular/core';

import { SkyTabLayoutType } from '../tab-layout-type';
import { SkyTabsetStyle } from '../tabset-style';
import { SkyTabsetComponent } from '../tabset.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './tabset.component.fixture.html',
  standalone: false,
})
export class TabsetTestComponent {
  public ariaLabel: string | undefined;

  public ariaLabelledBy: string | undefined;

  public tab1Heading = 'Tab 1';

  public tab1Content: string | undefined;

  public tab2Heading = 'Tab 2';

  public tab2Content: string | undefined;

  public tab2Available = model<boolean>(true);

  public tab2Disabled = false;

  public tab3Heading = 'Tab 3';

  public tab3HeaderCount: string | undefined;

  public tab3Content: string | undefined;

  public tab3Available = input<boolean>(true);

  public tab3Layout = input<SkyTabLayoutType | undefined>('blocks');

  public tabStyle = input<SkyTabsetStyle | undefined>('tabs');

  public activeTab = input<number>(0);

  public tabMaxWidth = 2000;

  @ViewChild(SkyTabsetComponent)
  public tabsetComponent: SkyTabsetComponent | undefined;

  public newTab() {}

  public openTab() {}

  public closeTab2() {
    this.tab2Available.set(false);
  }
}
