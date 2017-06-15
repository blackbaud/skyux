import { TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import {
  StacheJsonDataService,
  STACHE_JSON_DATA_SERVICE_CONFIG
} from './index';

describe('StacheJsonDataService', () => {
  let dataService: StacheJsonDataService;
  let config: any = {
    global: {
      productNameLong: 'Stache 2'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: STACHE_JSON_DATA_SERVICE_CONFIG, useValue: config },
        { provide: StacheJsonDataService, useClass: StacheJsonDataService }
      ]
    })
    .compileComponents();

    dataService = new StacheJsonDataService(config);
  });

  it('should return all data', () => {
    let data = dataService.getAll();
    expect(data.global.productNameLong).toBe('Stache 2');
  });

  it('should return data from a specific name', () => {
    let data = dataService.getByName('global');
    expect(data.productNameLong).toBe('Stache 2');
  });

  it('should return undefined if the name does not exist', () => {
    let data = dataService.getByName('invalid');
    expect(data).not.toBeDefined();
  });
});
