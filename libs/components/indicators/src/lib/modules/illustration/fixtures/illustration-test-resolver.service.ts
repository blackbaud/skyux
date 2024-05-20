import { Injectable } from '@angular/core';

import { SkyIllustrationResolverService } from '../illustration-resolver.service';

@Injectable()
export class SkyIllustrationTestResolverService extends SkyIllustrationResolverService {
  public override async resolveUrl(name: string): Promise<string> {
    switch (name) {
      case 'success':
        return 'https://example.com/success.svg';
      case 'success-data':
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEUM2XM3lppuAAAACklEQVQI12PACwAAHgAB2nHFigAAAABJRU5ErkJggg==';
      case 'fail':
        throw new Error('Image could not be resolved.');
    }
    return '';
  }
}
