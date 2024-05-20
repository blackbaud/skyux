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
// import { HttpClient } from '@angular/common/http';
// import { Injectable, inject } from '@angular/core';
// import { SkyIllustrationResolverService } from '@skyux/indicators';

// import { firstValueFrom } from 'rxjs';

// interface IllustrationManifest {
//   version: string;
//   illustrations: Record<
//     string,
//     {
//       url: string;
//     }
//   >;
// }
// @Injectable()
// export class SkyIllustrationTestResolverService extends SkyIllustrationResolverService {
//   #http = inject(HttpClient);
//   #manifestPromise: Promise<IllustrationManifest> | undefined;

//   public override async resolveUrl(name: string): Promise<string> {
//     this.#manifestPromise ??= firstValueFrom(
//       this.#http.get<IllustrationManifest>(
//         'https://sky.blackbaudcdn.net/static/skyux-illustrations/1/assets/manifest.json',
//       ),
//     );

//     const manifest = await this.#manifestPromise;
//     const matchingIllustration = manifest.illustrations[name];

//     if (matchingIllustration) {
//       return matchingIllustration.url;
//     }

//     console.error(`No illustration with the name '${name}' was found.`);

//     return '';
//   }
// }
