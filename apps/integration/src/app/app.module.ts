import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppAssetsService } from '@skyux/assets';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SkyThemeSelectorModule } from './shared/theme-selector/theme-selector.module';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    SkyFluidGridModule,
    SkyI18nModule,
    SkyThemeSelectorModule,
  ],
  providers: [
    SkyThemeService,
    {
      provide: SkyAppAssetsService,
      useValue: {
        getUrl: (path: string): string => `/assets/${path}`,
      },
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
