import { provideHttpClient } from '@angular/common/http';
import {
  EnvironmentProviders,
  NgModule,
  makeEnvironmentProviders,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as codeExampleExports from '@skyux/code-examples';
import { SkyHelpService } from '@skyux/core';
import {
  SkyDocsCodeExampleComponentTypes,
  provideSkyDocsCodeExampleTypes,
} from '@skyux/docs-tools';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExampleHelpService } from './help.service';
import { SkyThemeSelectorComponent } from './shared/theme-selector/theme-selector.component';

const CODE_EXAMPLES = codeExampleExports as SkyDocsCodeExampleComponentTypes;

/**
 * The help service must be provided for components that set the
 * `helpKey` attribute. For more information, review the global help
 * documentation.
 * @see https://developer.blackbaud.com/skyux/learn/develop/global-help
 */
function provideExampleHelpService(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SkyHelpService, useClass: ExampleHelpService },
  ]);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    SkyThemeSelectorComponent,
  ],
  providers: [
    provideHttpClient(),
    SkyThemeService,
    provideSkyDocsCodeExampleTypes(CODE_EXAMPLES),
    provideExampleHelpService(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
