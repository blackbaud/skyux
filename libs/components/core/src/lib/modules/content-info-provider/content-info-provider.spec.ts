import { TestBed } from '@angular/core/testing';

import { SkyContentInfoProvider } from './content-info-provider';
import { SkyDescriptor } from './descriptor';

describe('SkyContentInfoProvider', () => {
  let contentInfoProvider: SkyContentInfoProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyContentInfoProvider],
    });
    contentInfoProvider = TestBed.inject(SkyContentInfoProvider);
  });

  it('should get an observable of the content info', () => {
    const obs = contentInfoProvider.getInfo();
    expect(obs).toBeDefined();
  });

  it('should receive values from setContentInfo calls', (done) => {
    const contentDescriptor: SkyDescriptor = {
      type: 'text',
      value: 'value',
    };
    const obs = contentInfoProvider.getInfo();

    obs?.subscribe((value) => {
      expect(value.descriptor?.value).toEqual(contentDescriptor.value);
      done();
    });

    contentInfoProvider.patchInfo({
      descriptor: contentDescriptor,
    });
  });

  it('should receive the last value from setContentInfo when a value is set before getting observable', (done) => {
    const contentDescriptor: SkyDescriptor = {
      type: 'text',
      value: 'value',
    };

    contentInfoProvider.patchInfo({
      descriptor: {
        type: 'text',
        value: 'notTheLastValue',
      },
    });
    contentInfoProvider.patchInfo({
      descriptor: contentDescriptor,
    });

    const obs = contentInfoProvider.getInfo();

    obs?.subscribe((value) => {
      expect(value.descriptor).toEqual(contentDescriptor);
      done();
    });
  });
});
