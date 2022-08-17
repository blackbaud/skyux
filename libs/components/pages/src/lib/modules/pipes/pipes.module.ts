import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UseButtonPipe } from './use-button.pipe';
import { UseHrefPipe } from './use-href.pipe';
import { UseSkyAppLinkPipe } from './use-sky-app-link.pipe';
import { UseSkyHrefPipe } from './use-sky-href.pipe';

@NgModule({
  declarations: [UseSkyHrefPipe, UseHrefPipe, UseSkyAppLinkPipe, UseButtonPipe],
  exports: [UseSkyHrefPipe, UseHrefPipe, UseSkyAppLinkPipe, UseButtonPipe],
  imports: [CommonModule],
})
export class PipesModule {}
