import { NgModule } from '@angular/core';

import { StacheGridModule } from './modules/grid/grid.module';
import { StachePageAnchorModule } from './modules/page-anchor/page-anchor.module';
import { StacheMenuModule } from './modules/menu/menu.module';
import { StacheLayoutModule } from './modules/layout/layout.module';
import { StacheWrapperModule } from './modules/wrapper/wrapper.module';
import { StachePageHeaderModule } from './modules/page-header/page-header.module';
import { StacheBreadcrumbsModule } from './modules/breadcrumbs/breadcrumbs.module';

require('./styles/stache.scss');

@NgModule({
  exports: [
    StacheGridModule,
    StachePageAnchorModule,
    StacheMenuModule,
    StachePageHeaderModule,
    StacheLayoutModule,
    StacheWrapperModule,
    StacheBreadcrumbsModule
  ]
})
export class StacheModule { }
