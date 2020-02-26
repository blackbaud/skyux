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
  SkyCoreAdapterModule,
  SkyDockModule,
  SkyDynamicComponentModule,
  SkyMediaQueryModule,
  SkyNumericModule,
  SkyViewkeeperModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyCoreAdapterModule,
    SkyDockModule,
    SkyDocsToolsModule,
    SkyDynamicComponentModule,
    SkyMediaQueryModule,
    SkyNumericModule,
    SkyPageModule,
    SkyViewkeeperModule
  ],
  entryComponents: [
    DockItemVisualComponent,
    DynamicComponentDemoExampleComponent
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
