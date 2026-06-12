import { TestBed } from '@angular/core/testing';

import { SkyAppParamsConfig } from './params-config';
import { SkyAppParamsConfigArgs } from './params-config-args';

describe('SkyAppParamsConfig', () => {
  it('should return defaults', () => {
    TestBed.configureTestingModule({});
    const config = TestBed.inject(SkyAppParamsConfig);
    expect(config.params).toEqual({
      envid: {
        required: false,
      },
      leid: {
        required: false,
      },
      svcid: {
        required: false,
      },
    });
  });

  it('should allow params overrides', () => {
    const args = new SkyAppParamsConfigArgs();
    args.params = {
      foo: {
        value: 'bar',
      },
    };
    TestBed.configureTestingModule({
      providers: [{ provide: SkyAppParamsConfigArgs, useValue: args }],
    });
    const config = TestBed.inject(SkyAppParamsConfig);
    expect(config.params).toEqual({
      envid: {
        required: false,
      },
      foo: {
        value: 'bar',
      },
      leid: {
        required: false,
      },
      svcid: {
        required: false,
      },
    });
  });
});
