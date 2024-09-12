import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyModalModule } from '@skyux/modals';

import { SkyFlyoutHostsTestComponent } from './flyout-hosts.component.fixture';
import { SkyFlyoutModalFixtureFormComponent } from './flyout-modal-form.component';
import { SkyFlyoutTestSampleComponent } from './flyout-sample.component.fixture';
import { SkyFlyoutTestComponent } from './flyout.component.fixture';

@NgModule({
  declarations: [
    SkyFlyoutTestComponent,
    SkyFlyoutTestSampleComponent,
    SkyFlyoutHostsTestComponent,
    SkyFlyoutModalFixtureFormComponent,
  ],
  imports: [RouterTestingModule, SkyModalModule, NoopAnimationsModule],
  exports: [
    SkyFlyoutTestSampleComponent,
    SkyFlyoutHostsTestComponent,
    SkyFlyoutModalFixtureFormComponent,
  ],
})
export class SkyFlyoutFixturesModule {}
