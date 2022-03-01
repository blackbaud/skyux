import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyDefinitionListModule } from '@skyux/layout';

import { DefinitionListDemoComponent } from './definition-list-demo.component';

@NgModule({
  imports: [CommonModule, SkyDefinitionListModule],
  declarations: [DefinitionListDemoComponent],
  exports: [DefinitionListDemoComponent],
})
export class DefinitionListDemoModule {}
