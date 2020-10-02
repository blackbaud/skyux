import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyInputBoxModule
} from '@skyux/forms';

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
    SkyAppLinkModule,
    SkyAutocompleteModule,
    SkyCountryFieldModule,
    SkyDocsToolsModule,
    SkyInputBoxModule,
    SkyLookupModule,
    SkyRepeaterModule,
    SkySearchModule,
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
