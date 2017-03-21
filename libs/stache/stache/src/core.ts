import { NgModule } from '@angular/core';

import { StacheCodeModule } from './modules/code/code.module';
import { StacheGridModule } from './modules/grid/grid.module';
import { StachePageAnchorModule } from './modules/page-anchor/page-anchor.module';
import { StacheNavModule } from './modules/nav/nav.module';
import { StacheLayoutModule } from './modules/layout/layout.module';
import { StacheWrapperModule } from './modules/wrapper/wrapper.module';
import { StachePageHeaderModule } from './modules/page-header/page-header.module';

require('./styles/stache.scss');

@NgModule({
  exports: [
    StacheCodeModule,
    StacheGridModule,
    StachePageAnchorModule,
    StacheNavModule,
    StachePageHeaderModule,
    StacheLayoutModule,
    StacheWrapperModule
  ]
})
export class StacheModule { }
