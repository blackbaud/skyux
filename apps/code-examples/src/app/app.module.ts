import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyHelpService } from '@skyux/core';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CodeExamplesHelpService } from './shared/help-service/help-service';
import { SkyThemeSelectorComponent } from './shared/theme-selector/theme-selector.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    SkyThemeSelectorComponent,
  ],
  providers: [
    SkyThemeService,
    { provide: SkyHelpService, useClass: CodeExamplesHelpService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
