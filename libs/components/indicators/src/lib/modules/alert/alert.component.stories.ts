import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyAlertComponent } from './alert.component';
import { SkyAlertModule } from './alert.module';

export default {
  title: 'SkyAlertComponent',
  component: SkyAlertComponent,
  decorators: [
    moduleMetadata({
      imports: [SkyAlertModule],
    }),
  ],
} as Meta<SkyAlertComponent>;

const Template: Story<SkyAlertComponent> = (args: SkyAlertComponent) => ({
  component: SkyAlertComponent,
  props: args,
  template: `<sky-alert>Alert content.</sky-alert>`,
});

export const Primary = Template.bind({});
Primary.args = {
  alertType: '',
  closeable: false,
  closed: false,
};
