import { Injectable } from '@angular/core';
import { SkyIllustrationResolverService } from '@skyux/indicators';

@Injectable()
export class IllustrationResolverService extends SkyIllustrationResolverService {
  public override async resolveUrl(name: string): Promise<string> {
    const url =
      name === 'url'
        ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEUM2XM3lppuAAAACklEQVQI12PACwAAHgAB2nHFigAAAABJRU5ErkJggg=='
        : '';
    return await Promise.resolve(url);
  }

  public override async resolveHref(name: string): Promise<string> {
    const svgHref =
      name === 'url' ? '' : '#sky-illustration-accounting-invoice-mail';
    return await Promise.resolve(svgHref);
  }
}
