import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange
} from '@skyux/docs-tools';

import {
  SkyFlyoutConfig,
  SkyFlyoutInstance,
  SkyFlyoutService
} from '../../public/public_api';

import {
  FlyoutDocsFlyoutComponent
} from './flyout-docs-flyout.component';

@Component({
  selector: 'app-flyout-docs',
  templateUrl: './flyout-docs.component.html'
})
export class FlyoutDocsComponent {

  public flyout: SkyFlyoutInstance<any>;

  public demoSettings: any = {};

  constructor(
    private flyoutService: SkyFlyoutService
  ) { }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.iterators !== undefined) {
      this.demoSettings.iterators = change.iterators;
    }
    if (change.permalink !== undefined) {
      this.demoSettings.permalink = change.permalink;
    }
  }

  public openSimpleFlyout(): void {
    let flyoutConfig: SkyFlyoutConfig = {
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog'
    };

    if (this.demoSettings.iterators) {
      flyoutConfig.showIterator = true;
    }

    if (this.demoSettings.permalink) {
      flyoutConfig.permalink = {
        label: `Visit blackbaud.com`,
        url: 'http://www.blackbaud.com'
      };
    }

    this.flyout = this.flyoutService.open(FlyoutDocsFlyoutComponent, flyoutConfig);

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });
  }
}
