import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyPageModule
} from '@skyux/layout';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  DockItemVisualComponent
} from './demos/dock/dock-item-visual.component';

import {
  DynamicComponentDemoExampleComponent
} from './demos/dynamic-component/dynamic-component-example.component';

import {
  OverlayDemoExampleComponent
} from './demos/overlay/overlay-demo-example.component';

import {
  SkyAffixModule,
  SkyCoreAdapterModule,
  SkyDockModule,
  SkyDynamicComponentModule,
  SkyMediaQueryModule,
  SkyNumericModule,
  SkyOverlayModule,
  SkyViewkeeperModule
} from './public';

@NgModule({
  exports: [
    SkyAffixModule,
    SkyAppLinkModule,
    SkyCoreAdapterModule,
    SkyDockModule,
    SkyDocsToolsModule,
    SkyDynamicComponentModule,
    SkyMediaQueryModule,
    SkyNumericModule,
    SkyOverlayModule,
    SkyPageModule,
    SkyViewkeeperModule
  ],
  entryComponents: [
    DockItemVisualComponent,
    DynamicComponentDemoExampleComponent,
    OverlayDemoExampleComponent
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-core',
        packageName: '@skyux/core'
      }
    }
  ]
})
export class AppExtrasModule { }
