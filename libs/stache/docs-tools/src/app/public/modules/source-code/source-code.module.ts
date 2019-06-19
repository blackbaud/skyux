import {
  NgModule
} from '@angular/core';

import {
  SkyDocsSourceCodeProvider
} from './source-code-provider';

import {
  SkyDocsSourceCodeService
} from './source-code.service';

@NgModule({
  providers: [
    SkyDocsSourceCodeProvider,
    SkyDocsSourceCodeService
  ]
})
export class SkyDocsSourceCodeModule { }
