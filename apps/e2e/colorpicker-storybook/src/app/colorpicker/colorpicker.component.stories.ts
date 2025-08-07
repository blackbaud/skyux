import { Meta, moduleMetadata } from '@storybook/angular';

import { ColorpickerComponent } from './colorpicker.component';
import { ColorpickerModule } from './colorpicker.module';

export default {
  id: 'colorpickercomponent-colorpicker',
  title: 'Components/Colorpicker',
  component: ColorpickerComponent,
  decorators: [
    moduleMetadata({
      imports: [ColorpickerModule],
    }),
  ],
} as Meta<ColorpickerComponent>;
export const Colorpicker = {
  render: (args: ColorpickerComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
