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
    const obs = contentInfoProvider.getContentInfo();
    expect(obs).toBeDefined();
  });

  it('should receive values from setContentInfo calls', (done) => {
    const contentDescriptorValue = 'value';
    const obs = contentInfoProvider.getContentInfo();

    obs?.subscribe((value) => {
      expect(value.descriptor).toEqual(contentDescriptorValue);
      done();
    });

    contentInfoProvider.patchContentInfo({
      descriptor: contentDescriptorValue,
    });
  });

  it('should receive the last value from setContentInfo when a value is set before getting observable', (done) => {
    const contentDescriptorValue = 'value';

    contentInfoProvider.patchContentInfo({ descriptor: 'notTheLastValue' });
    contentInfoProvider.patchContentInfo({
      descriptor: contentDescriptorValue,
    });

    const obs = contentInfoProvider.getContentInfo();

    obs?.subscribe((value) => {
      expect(value.descriptor).toEqual(contentDescriptorValue);
      done();
    });
  });
});
