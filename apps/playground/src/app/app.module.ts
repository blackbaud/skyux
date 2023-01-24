import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyThemeService } from '@skyux/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { GreetingService } from './components/tiles/tile-dashboard/greeting/greeting.service';
// import { GreetingService } from './components/tiles/tile-dashboard/greeting/greeting.service';
import { SkyThemeSelectorModule } from './shared/theme-selector/theme-selector.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SkyFluidGridModule,
    SkyThemeSelectorModule,
  ],
  providers: [
    SkyThemeService,
    // Uncomment to confirm that providing the service in root allows for DI to resolve.
    // {
    //   provide: GreetingService,
    //   useValue: new GreetingService({ greeting: 'AppModule' }),
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
