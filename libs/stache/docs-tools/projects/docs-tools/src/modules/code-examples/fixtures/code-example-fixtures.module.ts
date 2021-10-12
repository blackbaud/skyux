import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDocsCodeExamplesModule
} from '../code-examples.module';

import {
  CodeExampleFixtureComponent
} from './code-example-fixture.component';

import {
  CodeExampleWithThemeServiceFixtureComponent
} from './code-example-with-theme-service-fixture.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDocsCodeExamplesModule
  ],
  exports: [
    CodeExampleFixtureComponent,
    CodeExampleWithThemeServiceFixtureComponent
  ],
  declarations: [
    CodeExampleFixtureComponent,
    CodeExampleWithThemeServiceFixtureComponent
  ],
  providers: []
})
export class CodeExampleFixturesModule { }
