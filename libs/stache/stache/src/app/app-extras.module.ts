import { NgModule } from '@angular/core';

require('smoothscroll-polyfill').polyfill();

import { StacheTitleService } from './shared/stache/modules/wrapper/title.service';
import { StacheNavService } from './shared/stache/modules/nav/nav.service';

require('style-loader!./app.scss');
require('style-loader!prismjs/themes/prism.css');

// Specify entry components, module-level providers, etc. here.
@NgModule({
  providers: [
    StacheTitleService,
    StacheNavService
  ]
})
export class AppExtrasModule { }
