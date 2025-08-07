import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as codeExampleExports from '@skyux/code-examples';
import {
  SkyDocsCodeExampleComponentTypes,
  provideSkyDocsCodeExampleTypes,
} from '@skyux/docs-tools';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CodeExamplesHelpService } from './shared/help-service/help-service';
import { SkyThemeSelectorComponent } from './shared/theme-selector/theme-selector.component';

const CODE_EXAMPLES = codeExampleExports as SkyDocsCodeExampleComponentTypes;

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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
