import { Component } from '@angular/core';

@Component({
  selector: 'app-flyout-demo-flyout',
  template: `
    <div class="sky-padding-even-large">
      <h2 id="flyout-title">Sample flyout</h2>
      <sky-tabset ariaLabel="Tab demonstration" permalinkId="blah">
        <sky-tab [tabHeading]="'Tab 1'"> TAB 1111111 </sky-tab>
        <sky-tab [tabHeading]="'Tab 2'"> TAB 22222222222 </sky-tab>
        <sky-tab [tabHeading]="'Tab 3'"> TAB 3333333333333333 </sky-tab>
      </sky-tabset>
    </div>
  `,
})
export class FlyoutTabsContentComponent {}
