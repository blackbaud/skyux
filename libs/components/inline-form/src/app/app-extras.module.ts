import {
  NgModule
} from '@angular/core';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyTilesModule
} from '@skyux/tiles';

import {
  SkyInlineFormModule
} from './public/public_api';

import {
  SkyTileDemoTileComponent
} from './visual/inline-form/inline-form-demo-tile.component';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDocsToolsModule,
    SkyIconModule,
    SkyIdModule,
    SkyInlineFormModule,
    SkyInputBoxModule,
    SkyTilesModule
  ],
  entryComponents: [
    SkyTileDemoTileComponent
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-inline-form',
        packageName: '@skyux/inline-form'
      }
    }
  ]
})
export class AppExtrasModule { }
