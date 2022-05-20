import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAgGridModule, SkyAgGridService } from '@skyux/ag-grid';
import { SkyDataManagerService } from '@skyux/data-manager';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { AgGridModule } from 'ag-grid-angular';

import { PreviewWrapperModule } from '../libs/components/storybook/src/lib/storybook/preview-wrapper/preview-wrapper.module';

export const parameters = {};

export const decorators = [
  moduleMetadata({
    imports: [
      AgGridModule,
      NoopAnimationsModule,
      SkyAgGridModule,
      PreviewWrapperModule,
      SkySearchModule,
      SkyToolbarModule,
    ],
    providers: [SkyAgGridService, SkyDataManagerService],
  }),
  componentWrapperDecorator(
    (story) => `${story}`,
    ({ globals }) => ({ theme: globals.theme })
  ),
];
