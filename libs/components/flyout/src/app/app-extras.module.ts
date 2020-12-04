import {
  NgModule
} from '@angular/core';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyDocsThumbnailModule,
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyInfiniteScrollModule
} from '@skyux/lists';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyToastModule
} from '@skyux/toast';

import {
  FlyoutDocsFlyoutComponent
} from './docs/flyout/flyout-docs-flyout.component';

import {
  SkyFlyoutModule
} from './public/public_api';

import {
  FlyoutDemoComponent
} from './visual/flyout/flyout-demo.component';

import {
  FlyoutResponsiveDemoComponent
} from './visual/flyout/flyout-responsive-demo.component';

import {
  SkyFlyoutModalDemoComponent
} from './visual/flyout/flyout-modal.component';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDocsThumbnailModule,
    SkyDocsToolsModule,
    SkyFlyoutModule,
    SkyDropdownModule,
    SkyModalModule,
    SkyToastModule,
    SkyInfiniteScrollModule,

    // The noop animations module needs to be loaded last to avoid
    // subsequent modules adding animations and overriding this.
    NoopAnimationsModule
  ],
  entryComponents: [
    FlyoutDemoComponent,
    FlyoutDocsFlyoutComponent,
    FlyoutResponsiveDemoComponent,
    SkyFlyoutModalDemoComponent
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-flyout',
        packageName: '@skyux/flyout'
      }
    }
  ]
})
export class AppExtrasModule { }
