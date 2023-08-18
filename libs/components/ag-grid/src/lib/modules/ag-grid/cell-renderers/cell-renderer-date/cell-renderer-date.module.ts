import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyDatePipeModule } from '@skyux/datetime';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';
import { SkyAgGridCellValidatorModule } from '../../cell-validator/ag-grid-cell-validator.module';

import { SkyAgGridCellRendererDateValidatorComponent } from './cell-renderer-date-validator.component';
import { SkyAgGridCellRendererDateComponent } from './cell-renderer-date.component';

@NgModule({
  imports: [
    CommonModule,
    SkyAgGridResourcesModule,
    SkyAgGridCellValidatorModule,
    FormsModule,
    SkyDatePipeModule,
  ],
  declarations: [
    SkyAgGridCellRendererDateComponent,
    SkyAgGridCellRendererDateValidatorComponent,
  ],
  exports: [
    SkyAgGridCellRendererDateComponent,
    SkyAgGridCellRendererDateValidatorComponent,
  ],
})
export class SkyAgGridCellRendererDateModule {}
