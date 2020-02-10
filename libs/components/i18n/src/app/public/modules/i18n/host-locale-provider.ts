import {
  Injectable
} from '@angular/core';

// A direct import is required to avoid a circular reference:
// Core depends on i18n, which depends on core...
// (This file will be removed entirely in the next major release.)
import {
  SkyAppWindowRef
} from '@skyux/core/modules/window/window-ref';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/of';

import {
  SkyAppLocaleInfo
} from './locale-info';

import {
  SkyAppLocaleProvider
} from './locale-provider';

@Injectable()
export class SkyAppHostLocaleProvider extends SkyAppLocaleProvider {
  constructor(
    private windowRef: SkyAppWindowRef
  ) {
    super();
  }

  public getLocaleInfo(): Observable<SkyAppLocaleInfo> {
    console.warn([
      'The class `SkyAppHostLocaleProvider`, imported from `@skyux/i18n`',
      'is deprecated. Please import from `@blackbaud/skyux-builder/runtime/i18n`',
      'or `@skyux-sdk/builder/runtime/i18n`.'
    ].join(' '));

    let locale: string;

    const skyuxHost = (this.windowRef.nativeWindow as any).SKYUX_HOST;

    if (skyuxHost) {
      const acceptLanguage = skyuxHost.acceptLanguage || '';
      locale = acceptLanguage.split(',')[0];
    }

    locale = locale || this.defaultLocale;

    return Observable.of({
      locale: locale
    });
  }
}
