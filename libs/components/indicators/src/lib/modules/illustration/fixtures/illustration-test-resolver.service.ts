import { Injectable } from '@angular/core';

import { SkyIllustrationResolverService } from '../illustration-resolver.service';

@Injectable()
export class SkyIllustrationTestResolverService extends SkyIllustrationResolverService {
  public override async resolveUrl(name: string): Promise<string> {
    let url = '';

    switch (name) {
      case 'success':
        url = 'https://example.com/success.svg';
        break;

      case 'success-data':
        url =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEUM2XM3lppuAAAACklEQVQI12PACwAAHgAB2nHFigAAAABJRU5ErkJggg==';
        break;

      case 'fail':
        throw new Error('Image could not be resolved.');
    }

    return await Promise.resolve(url);
  }
}
