import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PreviewWrapperModule } from '@skyux/storybook';
import { SkyThemeService } from '@skyux/theme';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { DataManagerModule } from '../src/app/visual/data-manager/data-manager.module';
import { EditComplexCellsModule } from '../src/app/visual/edit-complex-cells/edit-complex-cells.module';
import { EditInModalGridModule } from '../src/app/visual/edit-in-modal-grid/edit-in-modal-grid.module';
import { EditStopWhenLosesFocusModule } from '../src/app/visual/edit-stop-when-loses-focus/edit-stop-when-loses-focus.module';
import { EditableGridModule } from '../src/app/visual/editable-grid/editable-grid.module';
import { ReadonlyGridModule } from '../src/app/visual/readonly-grid/readonly-grid.module';

export const parameters = {};

export const decorators = [
  moduleMetadata({
    imports: [
      CommonModule,
      NoopAnimationsModule,
      PreviewWrapperModule,
      DataManagerModule,
      EditComplexCellsModule,
      EditInModalGridModule,
      EditStopWhenLosesFocusModule,
      EditableGridModule,
      ReadonlyGridModule,
    ],
    providers: [SkyThemeService],
  }),
  componentWrapperDecorator(
    (story) => `<sky-preview-wrapper>${story}</sky-preview-wrapper>`,
    ({ globals }) => ({ theme: globals.theme })
  ),
];
