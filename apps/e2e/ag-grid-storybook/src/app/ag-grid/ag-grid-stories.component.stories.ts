import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { AgGridStoriesComponent } from './ag-grid-stories.component';
import { AgGridStoriesModule } from './ag-grid-stories.module';

export default {
  id: 'aggridstoriescomponent-aggridstories',
  title: 'Components/Ag Grid',
  component: AgGridStoriesComponent,
  decorators: [
    moduleMetadata({
      imports: [AgGridStoriesModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<AgGridStoriesComponent>;
const Template: Story<AgGridStoriesComponent> = (
  args: AgGridStoriesComponent
) => ({
  props: args,
});

export const AgGrid = Template.bind({});
