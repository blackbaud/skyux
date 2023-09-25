import { TestBed } from '@angular/core/testing';

import { SkyContentInfoProvider } from './content-info-provider';

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
    const contentDescriptorValue = 'value';
    const obs = contentInfoProvider.getInfo();

    obs?.subscribe((value) => {
      expect(value.descriptor).toEqual(contentDescriptorValue);
      done();
    });

    contentInfoProvider.patchInfo({
      descriptor: contentDescriptorValue,
    });
  });

  it('should receive the last value from setContentInfo when a value is set before getting observable', (done) => {
    const contentDescriptorValue = 'value';

    contentInfoProvider.patchInfo({ descriptor: 'notTheLastValue' });
    contentInfoProvider.patchInfo({
      descriptor: contentDescriptorValue,
    });

    const obs = contentInfoProvider.getInfo();

    obs?.subscribe((value) => {
      expect(value.descriptor).toEqual(contentDescriptorValue);
      done();
    });
  });
});
