import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { SkyAlertComponent } from './alert.component';
import { SkyAlertModule } from './alert.module';

export default {
  title: 'Components/Indicators/Alert',
  component: SkyAlertComponent,
  decorators: [
    moduleMetadata({
      imports: [SkyAlertModule],
    }),
  ],
  argTypes: {
    alertType: {
      options: ['danger', 'info', 'success', 'warning'],
      control: { type: 'radio' },
    },
  },
} as Meta<SkyAlertComponent>;

const Template: Story<SkyAlertComponent> = (args: SkyAlertComponent) => ({
  props: args,
  template: `
      <sky-alert [alertType]="alertType" [closeable]="closeable" [(closed)]="closed">
        {{ content }}
      </sky-alert>
    `,
});

export const Danger = Template.bind({});
export const Info = Template.bind({});
export const Success = Template.bind({});
export const Warning = Template.bind({});

Danger.args = {
  alertType: 'danger',
  closeable: false,
  closed: false,
  content: `Danger alert.`,
};

Info.args = {
  alertType: 'info',
  closeable: false,
  closed: false,
  content: `Info alert.`,
};

Success.args = {
  alertType: 'success',
  closeable: false,
  closed: false,
  content: `Success alert.`,
};

Warning.args = {
  alertType: 'warning',
  closeable: false,
  closed: false,
  content: `Warning alert.`,
};
