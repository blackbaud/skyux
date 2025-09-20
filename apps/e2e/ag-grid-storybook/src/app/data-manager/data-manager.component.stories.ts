import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

import { DataManagerComponent } from './data-manager.component';
import { DataManagerModule } from './data-manager.module';

export default {
  id: 'datamanagercomponent-datamanager',
  title: 'Components/Data Manager',
  component: DataManagerComponent,
  decorators: [
    // Needed to address the 'No provider for ActivatedRoute!' for standalone components.
    // See: https://github.com/storybookjs/storybook/issues/21218
    applicationConfig({
      providers: [provideRouter([]), importProvidersFrom(SkyDataManagerModule)],
    }),
    moduleMetadata({
      imports: [DataManagerModule],
    }),
  ],
} as Meta<DataManagerComponent>;
type Story = StoryObj<DataManagerComponent>;

export const DataManagerNormal: Story = {};
DataManagerNormal.args = {
  domLayout: 'normal',
  enableTopScroll: false,
};

export const DataManagerNormalCompact: Story = {};
DataManagerNormalCompact.args = {
  compact: true,
  domLayout: 'normal',
  enableTopScroll: false,
};

export const DataManagerNormalWithTopScroll: Story = {};
DataManagerNormalWithTopScroll.args = {
  domLayout: 'normal',
  enableTopScroll: true,
};

export const DataManagerNormalWithTopScrollCompact: Story = {};
DataManagerNormalWithTopScrollCompact.args = {
  compact: true,
  domLayout: 'normal',
  enableTopScroll: true,
};

export const DataManagerAutoHeight: Story = {};
DataManagerAutoHeight.args = {
  domLayout: 'autoHeight',
  enableTopScroll: false,
};

export const DataManagerAutoHeightCompact: Story = {};
DataManagerAutoHeightCompact.args = {
  compact: true,
  domLayout: 'autoHeight',
  enableTopScroll: false,
};

export const DataManagerAutoHeightWithTopScroll: Story = {};
DataManagerAutoHeightWithTopScroll.args = {
  domLayout: 'autoHeight',
  enableTopScroll: true,
};

export const DataManagerAutoHeightWithTopScrollCompact: Story = {};
DataManagerAutoHeightWithTopScrollCompact.args = {
  compact: true,
  domLayout: 'autoHeight',
  enableTopScroll: true,
};

export const DataManagerWrapText: Story = {};
DataManagerWrapText.args = {
  compact: false,
  domLayout: 'normal',
  enableTopScroll: false,
  showSelect: true,
  wrapText: true,
  autoHeightColumns: true,
};

export const DataManagerWrapTextCompact: Story = {};
DataManagerWrapTextCompact.args = {
  compact: true,
  domLayout: 'normal',
  enableTopScroll: false,
  showSelect: true,
  wrapText: true,
  autoHeightColumns: true,
};

export const DataManagerWrapTextNoSelect: Story = {};
DataManagerWrapTextNoSelect.args = {
  compact: false,
  domLayout: 'normal',
  enableTopScroll: false,
  showSelect: false,
  wrapText: true,
  autoHeightColumns: true,
};

export const DataManagerWrapTextNoSelectCompact: Story = {};
DataManagerWrapTextNoSelectCompact.args = {
  compact: true,
  domLayout: 'normal',
  enableTopScroll: false,
  showSelect: false,
  wrapText: true,
  autoHeightColumns: true,
};
