import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualModule } from './visual/visual.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserAnimationsModule, AppRoutingModule, VisualModule],
  providers: [SkyThemeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
