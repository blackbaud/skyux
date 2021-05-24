import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyTextEditorResourcesModule
} from '../shared/text-editor-resources.module';

@NgModule({
  imports: [
    CommonModule,
    SkyTextEditorResourcesModule
  ]
})
export class SkyTextEditorModule {}
