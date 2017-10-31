import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { StacheWindowRef } from './window-ref';
import { StacheConfigService } from './config.service';
import { StacheRouteService } from './route.service';
import { StacheSearchResultsProvider } from './search-results-provider';
import { STACHE_JSON_DATA_PROVIDERS } from './json-data.service';
import { STACHE_ROUTE_METADATA_PROVIDERS } from './route-metadata.service';
import { StacheOmnibarAdapterService } from './omnibar-adapter.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    StacheConfigService,
    StacheRouteService,
    StacheSearchResultsProvider,
    StacheWindowRef,
    StacheOmnibarAdapterService,
    STACHE_JSON_DATA_PROVIDERS,
    STACHE_ROUTE_METADATA_PROVIDERS
  ]
})
export class StacheSharedModule { }
