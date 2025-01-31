import { NgModule } from '@angular/core';
import { SkyFormErrorModule } from '@skyux/forms';

import { SkyTextEditorComponent } from './text-editor.component';

/**
 * @docsIncludeIds SkyTextEditorComponent, SkyTextEditorFont, SkyTextEditorLinkWindowOptionsType, SkyTextEditorMenuType, SkyTextEditorStyleState, SkyTextEditorMergeField, SkyTextEditorToolbarActionType
 */
@NgModule({
  imports: [SkyTextEditorComponent],
  exports: [SkyTextEditorComponent, SkyFormErrorModule],
})
export class SkyTextEditorModule {}
