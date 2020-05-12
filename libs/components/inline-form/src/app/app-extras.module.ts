import {
  NgModule
} from '@angular/core';

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
    SkyIconModule,
    SkyInlineFormModule,
    SkyTilesModule
  ],
  entryComponents: [
    SkyTileDemoTileComponent
  ]
})
export class AppExtrasModule { }
