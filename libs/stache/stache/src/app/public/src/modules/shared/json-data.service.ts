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

    if (name.includes('.')) {
      const keys = name.split('.');
      return this.getNestedData(keys);
    }

    if (!this.jsonData[name]) {
      return;
    }

    return this.jsonData[name];
  }

  public getNestedData(keys: string[]) {

    let baseData = this.jsonData;

    for (let i = 0; i < keys.length; i++) {
      if (baseData[keys[i]] === undefined) {
        baseData = undefined;
        return;
      }

      baseData = baseData[keys[i]];
    }

    return baseData;
  }
}

export let STACHE_JSON_DATA_PROVIDERS: any[] = [
  { provide: STACHE_JSON_DATA_SERVICE_CONFIG, useValue: { } },
  { provide: StacheJsonDataService, useClass: StacheJsonDataService }
];
