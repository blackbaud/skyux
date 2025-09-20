import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyTextEditorModule } from '@skyux/text-editor';

import { TextEditorComponent } from './text-editor.component';

const routes: Routes = [{ path: '', component: TextEditorComponent }];
@NgModule({
  declarations: [TextEditorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SkyTextEditorModule,
    SkyHelpInlineModule,
  ],
  exports: [TextEditorComponent],
})
export class TextEditorModule {}
