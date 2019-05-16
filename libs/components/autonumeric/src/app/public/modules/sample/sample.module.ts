import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  MyLibrarySampleResourcesModule
} from '../shared/sample-resources.module';

import {
  MyLibrarySampleComponent
} from './sample.component';

import {
  MyLibraryService
} from './sample.service';

@NgModule({
  declarations: [
    MyLibrarySampleComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    MyLibrarySampleResourcesModule
  ],
  exports: [
    MyLibrarySampleComponent
  ],
  providers: [
    MyLibraryService
  ]
})
export class MyLibrarySampleModule { }
