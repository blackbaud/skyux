import { NgModule } from '@angular/core';

import * as smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

import { StacheTitleService } from './shared/stache/modules/wrapper/title.service';
import { StacheNavService } from './shared/stache/modules/nav/nav.service';
import { StacheWindowRef } from './shared/stache/modules/shared';

require('style-loader!./app.scss');
require('style-loader!prismjs/themes/prism.css');

// Specify entry components, module-level providers, etc. here.
@NgModule({
  providers: [
    StacheTitleService,
    StacheNavService,
    StacheWindowRef
  ]
})
export class AppExtrasModule { }
