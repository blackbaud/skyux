/* tslint:disable:no-console */

import * as FontFaceObserver from 'fontfaceobserver';

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

    spyOn(Promise, 'all').and.callFake(() => {
      return sampleObserver.load(undefined, 1);
    });

    const styleLoader = new SkyAppStyleLoader();

    styleLoader.loadStyles()
      .then((result) => {
        expect(result.error).toBeDefined();
        done();
      });
  });
});
