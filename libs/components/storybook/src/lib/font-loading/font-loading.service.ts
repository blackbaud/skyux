import { Injectable } from '@angular/core';
import design from '@blackbaud/skyux-design-tokens/json/design-tokens.json';

import FontFaceObserver from 'fontfaceobserver';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

const SPRITE_ID = 'sky-icon-svg-sprite';

async function waitForSvgSprite(): Promise<void> {
  return await new Promise<void>((resolve) => {
    if (document.getElementById(SPRITE_ID)) {
      resolve();
    } else {
      const observer = new MutationObserver((mutations) => {
        if (
          mutations.some((mutation) =>
            Array.from(mutation.addedNodes).some(
              (node) => (node as Element).id === SPRITE_ID,
            ),
          )
        ) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(document.body, {
        childList: true,
      });
    }
  });
}

@Injectable({
  providedIn: 'root',
})
export class FontLoadingService {
  public ready(waitForSvgIcons?: boolean): Observable<boolean> {
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
          },
        ),
    );
    fonts.push(
      new FontFaceObserver('FontAwesome', {
        weight: 400,
      }),
    );
    fonts.push(
      new FontFaceObserver('skyux-icons', {
        weight: 400,
      }),
    );

    const fontPromises = fonts.map((font) => font.load());

    if (waitForSvgIcons) {
      fontPromises.push(waitForSvgSprite());
    }

    return from(Promise.all(fontPromises)).pipe(map(() => true));
  }
}
