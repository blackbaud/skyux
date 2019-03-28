import {
  Injectable
} from '@angular/core';

import {
  SkyAppLocaleInfo,
  SkyAppResources
} from '../modules';

import {
  Format
} from '../utils/format';

import {
  Observable
} from 'rxjs/Observable';

import 'rxjs/add/observable/of';

declare const ROOT_DIR: string;
declare const require: { context: any };

@Injectable()
export class SkyLibResourcesTestService {
  constructor() {
    console.warn(
      'SkyLibResourcesTestService is no longer needed and' +
      'should be removed from any TestBed modules that provide it.'
    );
  }

  public getString(name: string, ...args: any[]): Observable<string> {
    const value = this.getStringForLocale(
      { locale: 'en_US' },
      name,
      ...args
    );

    return Observable.of(value);
  }

  public getStringForLocale(
    localeInfo: SkyAppLocaleInfo,
    name: string,
    ...args: any[]
  ): string {
    function throwMissingResourceError(message: string): void {
      throw new Error(
        'No matching string for the resource name "' + name + '" ' +
        'was found in the  default culture\'s resource file.  ' + message
      );
    }

    const resourcesContext = require.context(
      `${ROOT_DIR}/../..`,
      true,
      /\.\/assets\/locales\/resources_en_US\.json$/
    );

    const resources: SkyAppResources = resourcesContext.keys().map(resourcesContext)[0];

    if (!resources) {
      throwMissingResourceError(
        'No resource file exists for the default locale en-US. ' +
        'Did you append `--coverage library` to your test command?'
      );
    }

    const resource = resources[name];

    if (resource === undefined) {
      throwMissingResourceError(
        'Ensure your component or service is referencing a valid resource string.'
      );
    }

    return Format.formatText(resources[name].message, ...args);
  }
}
