import {
  NgModule
} from '@angular/core';

import {
  SkyIdModule
} from '@skyux/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyAlertModule
} from '@skyux/indicators';

import {
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyAutocompleteModule,
  SkyCountryFieldModule,
  SkyLookupModule,
  SkySearchModule
} from './public/public_api';

@NgModule({
  imports: [
    SkyAutocompleteModule,
    SkyCountryFieldModule,
    SkyLookupModule,
    SkySearchModule
  ],
  exports: [
    SkyAlertModule,
    SkyAppLinkModule,
    SkyAutocompleteModule,
    SkyCountryFieldModule,
    SkyDocsToolsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkyThemeModule,
    SkyToolbarModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-lookup',
        packageName: '@skyux/lookup'
      }
    }
  ],
  entryComponents: []
})
export class AppExtrasModule { }
