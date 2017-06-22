import { Inject, Injectable, InjectionToken } from '@angular/core';

export const STACHE_JSON_DATA_SERVICE_CONFIG
  = new InjectionToken<any>('Injection token for StacheJsonDataService config.');

@Injectable()
export class StacheJsonDataService {
  constructor(
    @Inject(STACHE_JSON_DATA_SERVICE_CONFIG)
    private jsonData: any) { }

  public getAll(): any {
    return this.jsonData;
  }

  public getByName(name: string): any {
    if (!this.jsonData[name]) {
      return;
    }

    return this.jsonData[name];
  }
}

export let STACHE_JSON_DATA_PROVIDERS: any[] = [
  { provide: STACHE_JSON_DATA_SERVICE_CONFIG, useValue: { } },
  { provide: StacheJsonDataService, useClass: StacheJsonDataService }
];
