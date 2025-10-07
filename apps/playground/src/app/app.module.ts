import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SKY_LOG_LEVEL, SkyHelpService, SkyLogLevel } from '@skyux/core';
import { SkyFluidGridModule } from '@skyux/layout';
import { provideIconPreview } from '@skyux/storybook/icon-preview';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaygroundHelpService } from './shared/help.service';
import { SkyThemeSelectorComponent } from './shared/theme-selector/theme-selector.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SkyFluidGridModule,
    SkyThemeSelectorComponent,
  ],
  providers: [
    SkyThemeService,
    { provide: SkyHelpService, useClass: PlaygroundHelpService },
    { provide: SKY_LOG_LEVEL, useValue: SkyLogLevel.Info },
    provideIconPreview(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
