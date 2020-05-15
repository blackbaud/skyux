import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyPageModule
} from '@skyux/layout';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDatePipeModule,
  SkyDatepickerModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyDateRangePickerModule,
    SkyDocsToolsModule,
    SkyPageModule,
    SkyTimepickerModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-datetime',
        packageName: '@skyux/datetime'
      }
    }
  ]
})
export class AppExtrasModule { }
