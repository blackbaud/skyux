import { Injectable } from '@angular/core';
import { text } from '@blackbaud/skyux-design-tokens/json/design-tokens.json';

import FontFaceObserver from 'fontfaceobserver';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FontLoadingService {
  public ready(): Observable<boolean> {
    const fonts: FontFaceObserver[] = [
      text.weight.light,
      text.weight.regular,
      text.weight.semibold,
      text.weight.condensed.light,
      text.weight.condensed.semibold,
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
