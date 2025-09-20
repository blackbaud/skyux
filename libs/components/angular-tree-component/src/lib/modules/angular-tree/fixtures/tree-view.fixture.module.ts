import { NgModule } from '@angular/core';
import { TreeModule } from '@blackbaud/angular-tree-component';
import { SkyDropdownModule } from '@skyux/popovers';

import { SkyAngularTreeModule } from '../angular-tree.module';

import { SkyTreeViewFixtureComponent } from './tree-view.fixture.component';

@NgModule({
  imports: [SkyAngularTreeModule, SkyDropdownModule, TreeModule],
  declarations: [SkyTreeViewFixtureComponent],
})
export class SkyTreeViewFixturesModule {}
