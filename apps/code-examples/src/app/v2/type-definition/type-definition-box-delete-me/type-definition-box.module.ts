import { NgModule } from '@angular/core';

import { SkyTypeDefinitionBoxHeaderComponent } from './type-definition-box-header.component';
import { SkyTypeDefinitionBoxComponent } from './type-definition-box.component';

@NgModule({
  imports: [SkyTypeDefinitionBoxComponent, SkyTypeDefinitionBoxHeaderComponent],
  exports: [SkyTypeDefinitionBoxComponent, SkyTypeDefinitionBoxHeaderComponent],
})
export class SkyTypeDefinitionBoxModule {}
