import { NgModule } from '@angular/core';

import { ResizeObserverBasicModule } from './basic/resize-observer-basic.module';
import { ResizeObserverFlyoutModule } from './flyout/resize-observer-flyout.module';
import { ResizeObserverModalModule } from './modal/resize-observer-modal.module';
import { ResizeObserverRoutingModule } from './resize-observer-routing.module';

@NgModule({
  imports: [
    ResizeObserverBasicModule,
    ResizeObserverFlyoutModule,
    ResizeObserverModalModule,
    ResizeObserverRoutingModule,
  ],
})
export class ResizeObserverModule {
  public static routes = ResizeObserverRoutingModule.routes;
}
