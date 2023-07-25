import { TestBed } from '@angular/core/testing';

import { SkyDefaultInputProvider } from './default-input-provider';

describe('Default input provider', () => {
  let defaultInputProvider: SkyDefaultInputProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyDefaultInputProvider],
    });
    defaultInputProvider = TestBed.inject(SkyDefaultInputProvider);
  });

  it('should get an observable for a given component input', () => {
    const obs = defaultInputProvider.getObservable('component', 'property');
    expect(obs).toBeDefined();
  });

  it('should receive values from setValue calls', (done) => {
    const propValue = 'test';
    const obs = defaultInputProvider.getObservable('component', 'property');

    obs?.subscribe((value) => {
      expect(value).toEqual(propValue);
      done();
    });

    defaultInputProvider.setValue('component', 'property', propValue);
  });

  it('should receive the last value from setValue when value set before getting observable', (done) => {
    const propValue = 'test';

    defaultInputProvider.setValue('component', 'property', 'notTheLastValue');
    defaultInputProvider.setValue('component', 'property', propValue);

    const obs = defaultInputProvider.getObservable('component', 'property');

    obs?.subscribe((value) => {
      expect(value).toEqual(propValue);
      done();
    });
  });
});
