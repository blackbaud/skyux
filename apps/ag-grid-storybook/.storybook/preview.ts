import {
  previewWrapperDecorators,
  previewWrapperGlobalTypes,
  previewWrapperParameters,
} from '@skyux/storybook';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { AgGridStylesheetComponent } from '../src/app/visual/ag-grid-stylesheet/ag-grid-stylesheet.component';
import { AgGridStylesheetModule } from '../src/app/visual/ag-grid-stylesheet/ag-grid-stylesheet.module';
import { DataManagerModule } from '../src/app/visual/data-manager/data-manager.module';
import { EditComplexCellsModule } from '../src/app/visual/edit-complex-cells/edit-complex-cells.module';
import { EditInModalGridModule } from '../src/app/visual/edit-in-modal-grid/edit-in-modal-grid.module';
import { EditStopWhenLosesFocusModule } from '../src/app/visual/edit-stop-when-loses-focus/edit-stop-when-loses-focus.module';
import { EditableGridModule } from '../src/app/visual/editable-grid/editable-grid.module';
import { ReadonlyGridModule } from '../src/app/visual/readonly-grid/readonly-grid.module';

export const parameters = {
  ...previewWrapperParameters,
};

export const globalTypes = {
  ...previewWrapperGlobalTypes,
};

export const decorators = [
  ...previewWrapperDecorators,
  moduleMetadata({
    imports: [
      AgGridStylesheetModule,
      DataManagerModule,
      EditComplexCellsModule,
      EditInModalGridModule,
      EditStopWhenLosesFocusModule,
      EditableGridModule,
      ReadonlyGridModule,
    ],
  }),
  componentWrapperDecorator(AgGridStylesheetComponent),
];
