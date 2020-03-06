import {
  NgModule
} from '@angular/core';

import {
  SkyAvatarModule
} from '@skyux/avatar';

import {
  SkyDocsToolsModule,
  SkyDocsToolsOptions
} from '@skyux/docs-tools';

import {
  SkyAlertModule,
  SkyKeyInfoModule,
  SkyLabelModule,
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyActionButtonModule,
  SkyBackToTopModule,
  SkyCardModule,
  SkyDefinitionListModule,
  SkyDockModule,
  SkyFluidGridModule,
  SkyInlineDeleteModule,
  SkyPageModule,
  SkyPageSummaryModule,
  SkyTextExpandModule,
  SkyTextExpandRepeaterModule,
  SkyToolbarModule
} from './public';

import {
  DockItemVisualComponent
} from './visual/dock/dock-item-visual.component';

@NgModule({
  exports: [
    SkyActionButtonModule,
    SkyAlertModule,
    SkyAppLinkModule,
    SkyAvatarModule,
    SkyBackToTopModule,
    SkyCardModule,
    SkyDefinitionListModule,
    SkyDockModule,
    SkyDocsToolsModule,
    SkyDropdownModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyLabelModule,
    SkyPageModule,
    SkyPageSummaryModule,
    SkyRepeaterModule,
    SkyTextExpandModule,
    SkyTextExpandRepeaterModule,
    SkyToolbarModule,
    SkyInlineDeleteModule
  ],
  entryComponents: [
    DockItemVisualComponent
  ],
  providers: [
    {
      provide: SkyDocsToolsOptions,
      useValue: {
        gitRepoUrl: 'https://github.com/blackbaud/skyux-layout',
        packageName: '@skyux/layout'
      }
    }
  ]
})
export class AppExtrasModule { }
