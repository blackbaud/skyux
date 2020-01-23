import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyDatePipeModule,
  SkyDatepickerModule,
  SkyDateRangePickerModule,
  SkyTimepickerModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyDatePipeModule,
    SkyDatepickerModule,
    SkyDocsToolsModule,
    SkyTimepickerModule,
    SkyDateRangePickerModule
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
