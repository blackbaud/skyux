import { Component } from '@angular/core';

@Component({
  selector: 'app-flyout-demo-flyout',
  template: `
    <div class="sky-padding-even-large">
      <h2 id="flyout-title">Sample flyout</h2>
      <sky-tabset ariaLabel="Tab demonstration">
        <sky-tab [tabHeading]="'Tab 1'"> Content for Tab 1 </sky-tab>
        <sky-tab [tabHeading]="'Tab 2'"> Content for Tab 2 </sky-tab>
        <sky-tab [tabHeading]="'Tab 3'"> Content for Tab 3 </sky-tab>
      </sky-tabset>
    </div>
  `,
})
export class FlyoutWithTabsContentIntegrationComponent {}
