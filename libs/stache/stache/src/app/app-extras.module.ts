import { NgModule } from '@angular/core';

require('smoothscroll-polyfill').polyfill();

import { StacheDemoComponentService } from './components/demo-component.service';
import { StacheTitleService } from './shared/stache/modules/wrapper/title.service';
import { StacheNavService } from './shared/stache/modules/nav/nav.service';

require('style-loader!./app.scss');
require('style-loader!prismjs/themes/prism.css');

// Specify entry components, module-level providers, etc. here.
@NgModule({
  providers: [
    StacheDemoComponentService,
    StacheTitleService,
    StacheNavService
  ]
})
export class AppExtrasModule { }
