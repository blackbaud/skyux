import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { StacheWindowRef } from './window-ref';
import { StacheConfigService } from './config.service';
import { StacheRouteService } from './route.service';
import { STACHE_JSON_DATA_PROVIDERS } from './json-data.service';
import { STACHE_ROUTE_METADATA_PROVIDERS } from './route-metadata.service';
import { StacheOmnibarAdapterService } from './omnibar-adapter.service';
import { StacheHttpService } from './http.service';

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [
    StacheConfigService,
    StacheHttpService,
    StacheRouteService,
    StacheWindowRef,
    StacheOmnibarAdapterService,
    STACHE_JSON_DATA_PROVIDERS,
    STACHE_ROUTE_METADATA_PROVIDERS
  ]
})
export class StacheSharedModule { }
