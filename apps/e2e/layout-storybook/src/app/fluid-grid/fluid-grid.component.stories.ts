import { Meta, moduleMetadata } from '@storybook/angular';

import { FluidGridComponent } from './fluid-grid.component';
import { FluidGridModule } from './fluid-grid.module';

export default {
  id: 'fluidgridcomponent-fluidgrid',
  title: 'Components/Fluid Grid',
  component: FluidGridComponent,
  decorators: [
    moduleMetadata({
      imports: [FluidGridModule],
    }),
  ],
} as Meta<FluidGridComponent>;
export const FluidGrid = {
  render: (args: FluidGridComponent): { props: unknown } => ({ props: args }),
  args: {},
};
