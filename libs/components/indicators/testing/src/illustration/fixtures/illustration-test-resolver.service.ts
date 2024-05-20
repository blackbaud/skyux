import { Injectable } from '@angular/core';
import { SkyIllustrationResolverService } from '@skyux/indicators';

@Injectable()
export class SkyIllustrationTestResolverService extends SkyIllustrationResolverService {
  public override async resolveUrl(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        switch (name) {
          case 'success':
            resolve('https://example.com/success.svg');
            break;
          case 'success-data':
            resolve(
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEUM2XM3lppuAAAACklEQVQI12PACwAAHgAB2nHFigAAAABJRU5ErkJggg==',
            );
            break;
          case 'fail':
            reject('Image could not be resolved.');
        }
      });
    });
  }
}
