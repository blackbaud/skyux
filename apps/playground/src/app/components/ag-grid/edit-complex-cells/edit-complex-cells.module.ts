import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';

import { AgGridModule } from 'ag-grid-angular';

import { CustomMultilineModule } from './custom-multiline/custom-multiline.module';
import { EditComplexCellsRoutingModule } from './edit-complex-cells-routing.module';
import { EditComplexCellsComponent } from './edit-complex-cells.component';
import { InlineHelpComponent } from './inline-help/inline-help.component';

@NgModule({
  declarations: [EditComplexCellsComponent, InlineHelpComponent],
  imports: [
    AgGridModule,
    CommonModule,
    CustomMultilineModule,
    EditComplexCellsRoutingModule,
    SkyAgGridModule,
    SkyToolbarModule,
    SkyHelpInlineModule,
  ],
})
export class EditComplexCellsModule {
  public static routes = EditComplexCellsRoutingModule.routes;
}
