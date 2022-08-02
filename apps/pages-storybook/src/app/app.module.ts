import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualModule } from './visual/visual.module';

@NgModule({
  declarations: [AppComponent],
  imports: [NoopAnimationsModule, AppRoutingModule, VisualModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
