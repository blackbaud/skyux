import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualModule } from './visual/visual.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, VisualModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
