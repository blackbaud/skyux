import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { BordersComponent } from './borders.component';
import { BordersModule } from './borders.module';

/* spell-checker:ignore borderscomponent */
export default {
  id: 'borderscomponent-borders',
  title: 'Components/Borders',
  component: BordersComponent,
  decorators: [
    moduleMetadata({
      imports: [BordersModule],
    }),
  ],
} as Meta<BordersComponent>;
const Template: Story<BordersComponent> = (args: BordersComponent) => ({
  props: args,
});
export const Borders = Template.bind({});
Borders.args = {};
