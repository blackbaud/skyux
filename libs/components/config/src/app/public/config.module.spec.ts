import {
  TestBed
} from '@angular/core/testing';

import {
  SkyAppConfigModule
} from './config.module';

import {
  SkyAppConfigHost
} from './host';

import {
  SkyAppParamsConfig
} from './params-config';

describe('SkyAppConfigModule', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyAppConfigModule
      ]
    });
  });

  it('should not add providers by default', () => {
    expect(() => TestBed.inject(SkyAppConfigHost))
      .toThrowError(/No provider for SkyAppConfigHost/);
  });

});

describe('SkyAppConfigModule.forRoot()', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyAppConfigModule.forRoot()
      ]
    });
  });

  it('should setup providers with default config', () => {
    const hostConfig = TestBed.inject(SkyAppConfigHost);
    expect(hostConfig.host).toEqual({
      frameOptions: {
        none: true
      },
      url: 'https://host.nxt.blackbaud.com/'
    });
  });

  it('should setup providers with config from forRoot args', () => {
    const hostConfig = TestBed.inject(SkyAppConfigHost);
    expect(hostConfig.host).toEqual({
      frameOptions: {
        none: true
      },
      url: 'https://host.nxt.blackbaud.com/'
    });
  });

});

describe('SkyAppConfigModule.forRoot()', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyAppConfigModule.forRoot({
          host: {
            frameOptions: {
              blackbaud: true
            }
          },
          params: {
            foo: {
              value: 'bar'
            }
          }
        })
      ]
    });
  });

  it('should setup providers with config from forRoot args', () => {
    const hostConfig = TestBed.inject(SkyAppConfigHost);
    const paramsConfig = TestBed.inject(SkyAppParamsConfig);
    expect(hostConfig.host.frameOptions).toEqual({
      blackbaud: true
    });
    expect(paramsConfig.params.foo).toEqual({
      value: 'bar'
    });
  });

});
