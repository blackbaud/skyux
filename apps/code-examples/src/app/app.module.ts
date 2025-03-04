import { provideHttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppAssetsService } from '@skyux/assets';
import * as codeExampleExports from '@skyux/code-examples';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SkyThemeSelectorComponent } from './shared/theme-selector/theme-selector.component';
import { type SkyDocsCodeExampleComponentTypes } from './v2/showcase/code-example-types/code-example-types-token';
import { provideSkyDocsCodeExampleTypes } from './v2/showcase/code-example-types/provide-code-example-types';

const EXAMPLES = codeExampleExports as SkyDocsCodeExampleComponentTypes;

@Injectable()
class CodeExamplesPlaygroundAssetsService extends SkyAppAssetsService {
  public getUrl(path: string): string {
    const urls: Record<string, string> = {};

    return urls[path];
  }

  public override getAllUrls(): Record<string, unknown> {
    return {};
  }
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
    {
      provide: SkyAppAssetsService,
      useClass: CodeExamplesPlaygroundAssetsService,
    },
    provideSkyDocsCodeExampleTypes(EXAMPLES),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
