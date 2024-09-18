import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SkyThemeSelectorComponent } from './shared/theme-selector/theme-selector.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    SkyThemeSelectorComponent,
  ],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
