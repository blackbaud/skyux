import { Injectable } from '@angular/core';
import * as _design from '@blackbaud/skyux-design-tokens/json/design-tokens.json';

import * as FontFaceObserver from 'fontfaceobserver';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

// This is needed to avoid the "Should not import the named export" error.
// See: https://stackoverflow.com/a/71835236/6178885
const design = _design;

@Injectable({
  providedIn: 'root',
})
export class FontLoadingService {
  public ready(): Observable<boolean> {
    const fonts: FontFaceObserver[] = [
      design.text.weight.light,
      design.text.weight.regular,
      design.text.weight.semibold,
      design.text.weight.condensed.light,
      design.text.weight.condensed.semibold,
    ].map(
      (weight) =>
        new FontFaceObserver(
          `BLKB Sans${weight.file.includes('-Cond') ? ' Condensed' : ''}`,
          {
            weight: weight.value,
          }
        )
    );
    fonts.push(
      new FontFaceObserver('FontAwesome', {
        weight: 400,
      })
    );
    fonts.push(
      new FontFaceObserver('skyux-icons', {
        weight: 400,
      })
    );
    return from(
      Promise.all(fonts.map(async (font): Promise<void> => font.load()))
    ).pipe(map(() => true));
  }
}
