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
// export class IllustrationResolverService extends SkyIllustrationResolverService {
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
import { Injectable } from '@angular/core';
import { SkyIllustrationResolverService } from '@skyux/indicators';

@Injectable()
export class IllustrationResolverService extends SkyIllustrationResolverService {
  public override async resolveUrl(): Promise<string> {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEUM2XM3lppuAAAACklEQVQI12PACwAAHgAB2nHFigAAAABJRU5ErkJggg==';
    // return 'https://sky.blackbaudcdn.net/static/skyux-illustrations/1/assets/svg/time-clock-circle.svg';
  }
}
