import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResizeObserverBasicComponent } from './resize-observer/basic/resize-observer-basic.component';
import { ResizeObserverBasicModule } from './resize-observer/basic/resize-observer-basic.module';
import { ResizeObserverFlyoutComponent } from './resize-observer/flyout/resize-observer-flyout.component';
import { ResizeObserverFlyoutModule } from './resize-observer/flyout/resize-observer-flyout.module';
import { ResizeObserverBaseComponent } from './resize-observer/modal/resize-observer-base.component';
import { ResizeObserverModalModule } from './resize-observer/modal/resize-observer-modal.module';

const routes: Routes = [
  { path: 'resize-observer/basic', component: ResizeObserverBasicComponent },
  { path: 'resize-observer/flyout', component: ResizeObserverFlyoutComponent },
  { path: 'resize-observer/modal', component: ResizeObserverBaseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    ResizeObserverBasicModule,
    ResizeObserverFlyoutModule,
    ResizeObserverModalModule,
  ],
})
export class CoreModule {}
