import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SkyInfiniteScrollModule } from '@skyux/lists';
import { SkyModalModule } from '@skyux/modals';
import { SkyDropdownModule } from '@skyux/popovers';

import { FlyoutDemoComponent } from './flyout/flyout-demo.component';
import { FlyoutModalDemoComponent } from './flyout/flyout-modal.component';
import { FlyoutResponsiveDemoContentComponent } from './flyout/flyout-responsive-demo-content.component';
import { FlyoutResponsiveDemoComponent } from './flyout/flyout-responsive-demo.component';
import { FlyoutVisualComponent } from './flyout/flyout-visual.component';
import { VisualComponent } from './visual.component';

@NgModule({
  declarations: [
    FlyoutDemoComponent,
    FlyoutModalDemoComponent,
    FlyoutResponsiveDemoContentComponent,
    FlyoutResponsiveDemoComponent,
    FlyoutVisualComponent,
    VisualComponent,
  ],
  //  Using NoopAnimationsModule for e2e tests.
  //  Replace this with BrowserAnimationsModule to see animations.
  imports: [
    CommonModule,
    NoopAnimationsModule,
    RouterModule,
    SkyDropdownModule,
    SkyInfiniteScrollModule,
    SkyModalModule,
  ],
  exports: [
    FlyoutDemoComponent,
    FlyoutModalDemoComponent,
    FlyoutResponsiveDemoContentComponent,
    FlyoutResponsiveDemoComponent,
    FlyoutVisualComponent,
    VisualComponent,
  ],
})
export class VisualModule {}
