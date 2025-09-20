import { Injectable, Optional } from '@angular/core';

import FontFaceObserver from 'fontfaceobserver';
import { take } from 'rxjs/operators';

import { SkyThemeService } from './theming/theme.service';

@Injectable({
  providedIn: 'root',
})
export class SkyAppStyleLoader {
  public static readonly LOAD_TIMEOUT = 3000;
  public isLoaded = false;

  #themeSvc: SkyThemeService | undefined;

  constructor(@Optional() themeSvc?: SkyThemeService) {
    this.#themeSvc = themeSvc;
  }

  public loadStyles(): Promise<any> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    let themePromise: Promise<any>;

    if (this.#themeSvc) {
      themePromise = this.#themeSvc.settingsChange.pipe(take(1)).toPromise();
    } else {
      themePromise = Promise.resolve();
    }

    const blackbaudSans = new FontFaceObserver('BLKB Sans');

    return Promise.all([
      blackbaudSans.load(undefined, SkyAppStyleLoader.LOAD_TIMEOUT),
      themePromise,
    ])
      .then(() => {
        this.isLoaded = true;
      })
      .catch((error) => {
        // Errors loading the font should not stop the page from rendering.
        // Passing the error along in case the client wants to do something with it.
        return Promise.resolve({
          error,
        });
      });
  }
}
