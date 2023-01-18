import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyThemeModule } from '@skyux/theme';

import { OnPushComponent } from './on-push.component';
import { ThemingComponent } from './theming.component';

const routes: Routes = [{ path: '', component: ThemingComponent }];
@NgModule({
  declarations: [ThemingComponent, OnPushComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyThemeModule],
  exports: [ThemingComponent],
})
export class ThemingModule {}
