import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyTilesModule
} from '@skyux/tiles';

import {
  SkyInlineFormModule
} from './public/modules/inline-form/inline-form.module';

import {
  SkyTileDemoTileComponent
} from './visual/inline-form/inline-form-demo-tile.component';

@NgModule({
  exports: [
    SkyIconModule,
    SkyInlineFormModule,
    SkyTilesModule
  ],
  entryComponents: [
    SkyTileDemoTileComponent
  ]
})
export class AppExtrasModule { }
