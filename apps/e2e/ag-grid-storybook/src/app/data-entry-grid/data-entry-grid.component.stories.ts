import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { DataEntryGridComponent } from './data-entry-grid.component';
import { DataEntryGridModule } from './data-entry-grid.module';

export default {
  id: 'dataentrygridcomponent-dataentrygrid',
  title: 'Components/Data Entry Grid',
  component: DataEntryGridComponent,
  decorators: [
    moduleMetadata({
      imports: [DataEntryGridModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
  argTypes: {
    variation: {
      control: {
        type: 'select',
        options: ['date-and-lookup', 'edit-lookup'],
      },
    },
  },
} as Meta<DataEntryGridComponent>;
const Template: Story<DataEntryGridComponent> = (
  args: DataEntryGridComponent
) => ({
  props: args,
});

export const DataEntryGridDateAndLookup = Template.bind({});
DataEntryGridDateAndLookup.args = {
  variation: 'date-and-lookup',
};

export const DataEntryGridEditLookup = Template.bind({});
DataEntryGridEditLookup.args = {
  variation: 'edit-lookup',
};
