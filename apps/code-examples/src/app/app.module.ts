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
import { type SkyDocsShowcaseModuleExportsType } from './v2/showcase/examples-token';
import { provideSkyDocsShowcaseExamples } from './v2/showcase/provide-showcase';

const EXAMPLES = codeExampleExports as SkyDocsShowcaseModuleExportsType;

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
    provideSkyDocsShowcaseExamples(EXAMPLES),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
