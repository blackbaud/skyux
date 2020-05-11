import * as FontFaceObserver from 'fontfaceobserver';

import {
  Subject
} from 'rxjs';

import {
  SkyAppStyleLoader
} from './style-loader';

describe('Style loader', () => {
  it('should resolve a promise after loading fonts', (done) => {
    spyOn(FontFaceObserver.prototype, 'load').and.returnValue(
      Promise.resolve()
    );

    const styleLoader = new SkyAppStyleLoader();

    styleLoader.loadStyles()
      .then(() => {
        expect(styleLoader.isLoaded).toBe(true);
        done();
      });
  });

  it('should pass errors to the resolve', (done) => {
    spyOn(Promise, 'all').and.callFake(() => {
      return Promise.reject(new Error('Fonts not loaded.'));
    });

    const styleLoader = new SkyAppStyleLoader();

    styleLoader.loadStyles()
      .then((response) => {
        expect(response.error.message).toBe('Fonts not loaded.');
        done();
      });
  });

  it('should resolve the promise if the fonts are not loaded within the timeout', (done) => {
    const sampleObserver = new FontFaceObserver('SampleFont');

    spyOn(Promise, 'all').and.callFake((): Promise<any> => {
      return sampleObserver.load(undefined, 1);
    });

    const styleLoader = new SkyAppStyleLoader();

    styleLoader.loadStyles()
      .then((result) => {
        expect(result.error).toBeDefined();
        done();
      });
  });

  it('should resolve if fonts already loaded', (done) => {
    const spy = spyOn(FontFaceObserver.prototype, 'load').and.returnValue(
      Promise.resolve()
    );

    const styleLoader = new SkyAppStyleLoader();
    styleLoader.isLoaded = true;

    styleLoader.loadStyles()
      .then(() => {
        expect(spy).not.toHaveBeenCalled();
        done();
      });
  });

  it('should resolve a promise after initial theme settings have been provided', (done) => {
    spyOn(FontFaceObserver.prototype, 'load').and.returnValue(
      Promise.resolve()
    );

    const mockThemeSvc: any = {
      settingsChange: new Subject<any>()
    };

    const styleLoader = new SkyAppStyleLoader(mockThemeSvc);

    styleLoader.loadStyles()
      .then(() => {
        expect(styleLoader.isLoaded).toBe(true);
        done();
      });

    expect(styleLoader.isLoaded).toBe(false);

    mockThemeSvc.settingsChange.next({});
  });
});
