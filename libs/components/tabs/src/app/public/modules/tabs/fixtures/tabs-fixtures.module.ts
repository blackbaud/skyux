import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyModalModule } from '@skyux/modals/modules/modal';

import { SkyTabsModule } from '../';
import { TabsetTestComponent } from './tabset.component.fixture';
import { SkyWizardTestFormComponent } from './tabset-wizard.component.fixture';
import { TabsetActiveTestComponent } from './tabset-active.component.fixture';

@NgModule({
  declarations: [
    TabsetTestComponent,
    SkyWizardTestFormComponent,
    TabsetActiveTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyModalModule,
    SkyTabsModule,
    NoopAnimationsModule
  ],
  exports: [
    TabsetTestComponent,
    SkyWizardTestFormComponent,
    TabsetActiveTestComponent
  ],
  entryComponents: [
    SkyWizardTestFormComponent
  ]
})
export class SkyTabsFixturesModule { }
