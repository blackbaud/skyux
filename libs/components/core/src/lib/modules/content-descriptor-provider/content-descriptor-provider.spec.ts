import { TestBed } from '@angular/core/testing';

import { SkyContentDescriptorProvider } from './content-descriptor-provider';

describe('SkyContentDescriptorProvider', () => {
  let contentDescriptorProvider: SkyContentDescriptorProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyContentDescriptorProvider],
    });
    contentDescriptorProvider = TestBed.inject(SkyContentDescriptorProvider);
  });

  it('should get an observable of the content descriptor', () => {
    const obs = contentDescriptorProvider.getContentDescriptor();
    expect(obs).toBeDefined();
  });

  it('should receive values from setContentDescriptor calls', (done) => {
    const contentDescriptorValue = 'value';
    const obs = contentDescriptorProvider.getContentDescriptor();

    obs?.subscribe((value) => {
      expect(value).toEqual(contentDescriptorValue);
      done();
    });

    contentDescriptorProvider.setContentDescriptor(contentDescriptorValue);
  });

  it('should receive the last value from setContentDescriptor when a value is set before getting observable', (done) => {
    const contentDescriptorValue = 'value';

    contentDescriptorProvider.setContentDescriptor('notTheLastValue');
    contentDescriptorProvider.setContentDescriptor(contentDescriptorValue);

    const obs = contentDescriptorProvider.getContentDescriptor();

    obs?.subscribe((value) => {
      expect(value).toEqual(contentDescriptorValue);
      done();
    });
  });
});
