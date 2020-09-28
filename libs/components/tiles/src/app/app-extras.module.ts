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
  TileDemoTile1Component
} from './docs/tiles/tile-demo-tile1.component';

import {
  TileDemoTile2Component
} from './docs/tiles/tile-demo-tile2.component';

import {
  SkyTilesModule
} from './public/public_api';

import {
  SkyTileDemoTile1Component
} from './visual/tiles/tile-demo-tile1.component';

import {
  SkyTileDemoTile2Component
} from './visual/tiles/tile-demo-tile2.component';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDocsToolsModule,
    SkyPageModule,
    SkyTilesModule
  ],
  entryComponents: [
    SkyTileDemoTile1Component,
    SkyTileDemoTile2Component,
    TileDemoTile1Component,
    TileDemoTile2Component
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-tiles',
        packageName: '@skyux/tiles'
      }
    }
  ]
})
export class AppExtrasModule { }
