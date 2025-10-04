import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideInitialTheme } from '@skyux/theme';

import { routes } from './app/app-routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideInitialTheme('modern')],
}).catch((err) => console.error(err));
