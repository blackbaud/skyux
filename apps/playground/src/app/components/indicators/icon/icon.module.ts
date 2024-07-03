import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';

import { IconRoutingModule } from './icon-routing.module';
import { IconDemoComponent } from './icon.component';

@NgModule({
  imports: [CommonModule, IconDemoComponent, IconRoutingModule, SkyAlertModule],
})
export class IconModule {
  public static routes = IconRoutingModule.routes;
}
