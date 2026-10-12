import type { Meta, StoryObj } from '@storybook/angular';

import { FluidGridNestedComponent } from './fluid-grid-nested.component';

export default {
  id: 'fluid-grid-nestedcomponent',
  title: 'Components/Fluid Grid Nested',
  component: FluidGridNestedComponent,
} as Meta<FluidGridNestedComponent>;
type Story = StoryObj<FluidGridNestedComponent>;
export const FluidGridNested: Story = {};
FluidGridNested.args = {};
