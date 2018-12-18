import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyDynamicComponentModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyA11yResourcesModule
} from '../shared/a11y-resources.module';

import {
  SkySkipLinkService
} from './skip-link.service';

import {
  SkySkipLinkHostComponent
} from './skip-link-host.component';

import {
  SkySkipLinkAdapterService
} from './skip-link-adapter.service';

/**
 * The Angular module that enables "skip links" to be added to the page.
 */
@NgModule({
  entryComponents: [
    SkySkipLinkHostComponent
  ],
  declarations: [
    SkySkipLinkHostComponent
  ],
  imports: [
    CommonModule,
    SkyDynamicComponentModule,
    SkyI18nModule,
    SkyA11yResourcesModule
  ],
  providers: [
    SkySkipLinkAdapterService,
    SkySkipLinkService
  ]
})
export class SkySkipLinkModule { }
