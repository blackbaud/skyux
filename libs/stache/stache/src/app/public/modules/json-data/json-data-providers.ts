import {
  STACHE_JSON_DATA_SERVICE_CONFIG
} from './json-data-service-config-token';

import {
  StacheJsonDataService
} from './json-data.service';

export let STACHE_JSON_DATA_PROVIDERS: any[] = [
  { provide: STACHE_JSON_DATA_SERVICE_CONFIG, useValue: { } },
  { provide: StacheJsonDataService, useClass: StacheJsonDataService }
];
