import * as FontFaceObserver from 'fontfaceobserver';

import { Injectable } from '@angular/core';

@Injectable()
export class SkyAppStyleLoader {
  public static readonly LOAD_TIMEOUT: number = 3000;
  public isLoaded: boolean = false;

  public loadStyles(): Promise<any> {
    const fontAwesome = new FontFaceObserver('FontAwesome');
    const blackbaudSans = new FontFaceObserver('Blackbaud Sans');

    return Promise
      .all([
        // Specify a character for FontAwesome since some browsers will fail to detect
        // when the font is loaded unless a known character with a different width
        // than the default is not specified.
        fontAwesome.load('\uf0fc', SkyAppStyleLoader.LOAD_TIMEOUT),
        blackbaudSans.load(undefined, SkyAppStyleLoader.LOAD_TIMEOUT)
      ])
      .then(() => {
        this.isLoaded = true;
      })
      .catch((error) => {
        // Errors loading the font should not stop the page from rendering.
        // Passing the error along in case the client wants to do something with it.
        return Promise.resolve({
          error: error
        });
      });
  }
}
