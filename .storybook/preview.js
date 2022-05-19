import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { AgGridModule } from 'ag-grid-angular';

import {
  SkyAgGridModule,
  SkyAgGridService,
} from '../libs/components/ag-grid/src';
import { SkyDataManagerService } from '../libs/components/data-manager/src';
import { SkyToolbarModule } from '../libs/components/layout/src';
import { SkySearchModule } from '../libs/components/lookup/src';
import { SkyE2eThemeSelectorModule } from '../libs/components/storybook/src/lib/theme-selector/theme-selector.module';
import { SkyThemeService } from '../libs/components/theme/src';

export const parameters = {};

export const decorators = [
  moduleMetadata({
    imports: [
      AgGridModule,
      NoopAnimationsModule,
      SkyAgGridModule,
      SkyE2eThemeSelectorModule,
      SkySearchModule,
      SkyToolbarModule,
    ],
    providers: [SkyAgGridService, SkyDataManagerService, SkyThemeService],
  }),
  componentWrapperDecorator(
    (story) => `${story}`,
    ({ globals }) => ({ theme: globals.theme })
  ),
];
