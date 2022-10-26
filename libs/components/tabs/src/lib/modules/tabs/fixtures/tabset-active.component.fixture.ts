import { Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './tabset-active.component.fixture.html',
})
export class TabsetActiveTestComponent {
  public tab1Heading = 'Tab 1';

  public tab1Content: string | undefined;

  public tab2Heading = 'Tab 2';

  public tab2Content: string | undefined;

  public tab2Available = true;

  public tab1Available = true;

  public tab3Heading = 'Tab 3';

  public tab3Content: string | undefined;

  public tab3Available = true;

  public activeIndex: string | number | undefined = 0;

  public tabMaxWidth = 2000;

  public tab4Available = true;
  public tab4Heading = 'Tab 4';
  public tab4Content: string | undefined;

  public newTab() {}

  public openTab() {}

  public tabChanged(newTab: any) {
    this.activeIndex = newTab;
  }
}
