import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyBackToTopModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';
import { PreviewWrapperModule } from '@skyux/storybook/components';
import { SkyThemeModule } from '@skyux/theme';

import { AgGridModule } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { InlineHelpModule } from '../shared/inline-help/inline-help.module';

import { AgGridStoriesComponent } from './ag-grid-stories.component';
import { ContextMenuComponent } from './context-menu.component';

ModuleRegistry.registerModules([AllCommunityModule]);

const routes: Routes = [{ path: '', component: AgGridStoriesComponent }];
@NgModule({
  declarations: [AgGridStoriesComponent, ContextMenuComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyAgGridModule,
    AgGridModule,
    InlineHelpModule,
    SkyDropdownModule,
    SkyBackToTopModule,
    SkyThemeModule,
    PreviewWrapperModule,
  ],
  exports: [AgGridStoriesComponent, ContextMenuComponent],
})
export class AgGridStoriesModule {}
