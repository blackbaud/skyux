import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyLookupModule } from '@skyux/lookup';
import { SkyAgGridCellEditorLookupComponent } from './cell-editor-lookup.component';

@NgModule({
  declarations: [SkyAgGridCellEditorLookupComponent],
  exports: [SkyAgGridCellEditorLookupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyI18nModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class SkyAgGridCellEditorLookupModule {}
