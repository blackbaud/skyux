import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyDocsCodeExamplesModule } from '../code-examples.module';

import { CodeExampleFixtureComponent } from './code-example-fixture.component';
import { CodeExampleWithThemeServiceFixtureComponent } from './code-example-with-theme-service-fixture.component';
import { CodeExamplesFixtureComponent } from './code-examples-fixture.component';

@NgModule({
  imports: [NoopAnimationsModule, SkyDocsCodeExamplesModule],
  exports: [
    CodeExampleFixtureComponent,
    CodeExamplesFixtureComponent,
    CodeExampleWithThemeServiceFixtureComponent,
  ],
  declarations: [
    CodeExampleFixtureComponent,
    CodeExamplesFixtureComponent,
    CodeExampleWithThemeServiceFixtureComponent,
  ],
  providers: [],
})
export class CodeExampleFixturesModule {}
