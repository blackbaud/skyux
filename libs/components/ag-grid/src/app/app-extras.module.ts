import {
  NgModule
} from '@angular/core';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyDataManagerModule
} from '@skyux/data-manager';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyInfiniteScrollModule,
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyBackToTopModule,
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkySearchModule
} from '@skyux/lookup';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  AgGridModule
} from 'ag-grid-angular';

import {
  SkyAgGridModule
} from './public/public_api';

import {
  SkyAgGridEditModalComponent
} from './visual/edit-in-modal-grid/ag-grid-edit-modal.component';

import {
  ReadonlyGridContextMenuComponent
} from './visual/readonly-grid/readonly-grid-context-menu.component';

import {
  SkyDataManagerFiltersModalVisualComponent
} from './visual/data-manager/data-filter-modal.component';

@NgModule({
  declarations: [],
  imports: [
    AgGridModule.withComponents([ReadonlyGridContextMenuComponent])
  ],
  exports: [
    AgGridModule,
    SkyAgGridModule,
    SkyAppLinkModule,
    SkyCheckboxModule,
    SkyDataManagerModule,
    SkyDocsToolsModule,
    SkyDropdownModule,
    SkyInfiniteScrollModule,
    SkyModalModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkyToolbarModule,
    SkyBackToTopModule
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-ag-grid',
        packageName: '@skyux/ag-grid'
      }
    }
  ],
  entryComponents: [
    SkyAgGridEditModalComponent,
    SkyDataManagerFiltersModalVisualComponent
  ]
})
export class AppExtrasModule { }
