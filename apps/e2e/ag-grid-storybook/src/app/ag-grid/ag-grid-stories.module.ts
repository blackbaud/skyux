import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyIconModule } from '@skyux/indicators';
import { SkyBackToTopModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';
import { PreviewWrapperModule } from '@skyux/storybook';
import { SkyThemeModule, SkyThemeService } from '@skyux/theme';

import { AgGridModule } from 'ag-grid-angular';

import { AgGridStoriesComponent } from './ag-grid-stories.component';
import { ContextMenuComponent } from './context-menu.component';

const routes: Routes = [{ path: '', component: AgGridStoriesComponent }];
@NgModule({
  declarations: [AgGridStoriesComponent, ContextMenuComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyAgGridModule,
    AgGridModule,
    SkyDropdownModule,
    SkyBackToTopModule,
    SkyThemeModule,
    PreviewWrapperModule,
    SkyIconModule,
  ],
  providers: [SkyThemeService],
  exports: [AgGridStoriesComponent, ContextMenuComponent],
})
export class AgGridStoriesModule {}
