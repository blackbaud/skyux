import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TextEditorComponent } from './text-editor.component';

const routes: Routes = [{ path: '', component: TextEditorComponent }];
@NgModule({
  declarations: [TextEditorComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [TextEditorComponent],
})
export class TextEditorModule {}
