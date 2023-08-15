import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyA11yResourcesModule } from '../shared/sky-a11y-resources.module';

import { SkySkipLinkHostComponent } from './skip-link-host.component';
import { SkySkipLinkService } from './skip-link.service';

/**
 * The Angular module that enables "skip links" to be added to the page.
 */
@NgModule({
  declarations: [SkySkipLinkHostComponent],
  imports: [CommonModule, SkyA11yResourcesModule],
  providers: [SkySkipLinkService],
})
export class SkySkipLinkModule {}
