import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { AgGridStoriesComponent } from './ag-grid-stories.component';
import { AgGridStoriesModule } from './ag-grid-stories.module';

/* spell-checker:ignore aggridstoriescomponent, aggridstories */
export default {
  id: 'aggridstoriescomponent-aggridstories',
  title: 'Components/Ag Grid',
  component: AgGridStoriesComponent,
  decorators: [
    moduleMetadata({
      imports: [AgGridStoriesModule],
    }),
  ],
} as Meta<AgGridStoriesComponent>;
const Template: Story<AgGridStoriesComponent> = (
  args: AgGridStoriesComponent
) => ({
  props: args,
});

export const AgGrid = Template.bind({});
