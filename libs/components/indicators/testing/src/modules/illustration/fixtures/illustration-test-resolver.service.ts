import { Injectable } from '@angular/core';
import { SkyIllustrationResolverService } from '@skyux/indicators';

@Injectable()
export class SkyIllustrationTestResolverService extends SkyIllustrationResolverService {
  public override async resolveUrl(name: string): Promise<string> {
    return await new Promise((resolve, reject) => {
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
          case 'svg':
            resolve('');
            break;
          case 'fail':
            reject('Image could not be resolved.');
        }
      });
    });
  }

  public override async resolveHref(name: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        switch (name) {
          case 'svg':
            resolve(
              '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.997 14C7.4033 14 6.84558 13.7656 6.42579 13.3449L2.65367 9.56479C2.23388 9.14411 2 8.5852 2 7.99023C2 7.39527 2.23388 6.83636 2.65367 6.41568L6.42579 2.63553C7.26537 1.78816 8.73463 1.78816 9.57421 2.63553L13.3463 6.41568C13.7661 6.83636 14 7.39527 14 7.99023C14 8.5852 13.7661 9.14411 13.3463 9.56479L9.57421 13.3449C9.15442 13.7656 8.5967 14 8.003 14H7.997ZM7.997 2.8639C7.63718 2.8639 7.30135 3.00213 7.04948 3.26055L3.27736 7.04069C3.02549 7.2931 2.88156 7.62965 2.88156 7.99023C2.88156 8.35082 3.01949 8.68737 3.27736 8.93978L7.04948 12.7199C7.55922 13.2368 8.44078 13.2308 8.95052 12.7199L12.7226 8.93978C12.9745 8.68737 13.1184 8.34481 13.1184 7.99023C13.1184 7.63566 12.9805 7.2931 12.7226 7.04069L8.95052 3.26055C8.69865 3.00213 8.35682 2.8639 8.003 2.8639H7.997Z" fill="black"/></svg>',
            );
            break;
          default:
            resolve('');
            break;
          case 'fail':
            reject('SVG could not be resolved.');
        }
      });
    });
  }
}
