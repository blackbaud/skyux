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
  SkyCheckboxModule,
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
  SkyModalModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyLookupDocsDemoModalComponent
} from './docs/lookup/lookup-docs-demo-modal.component';

import {
  SkyAutocompleteModule,
  SkyCountryFieldModule,
  SkyLookupModule,
  SkySearchModule
} from './public/public_api';

import {
  SkyLookupVisualCustomPickerComponent
} from './visual/lookup/lookup-visual-custom-picker.component';

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
    SkyCheckboxModule,
    SkyCountryFieldModule,
    SkyDocsToolsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
    SkyModalModule,
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
  entryComponents: [
    SkyLookupDocsDemoModalComponent,
    SkyLookupVisualCustomPickerComponent
  ]
})
export class AppExtrasModule { }
