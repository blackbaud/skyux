import type { Meta, StoryObj } from '@storybook/angular';

import { ContainersComponent } from './containers.component';

export default {
  id: 'containerscomponent',
  title: 'Components/Containers',
  component: ContainersComponent,
} as Meta<ContainersComponent>;
type Story = StoryObj<ContainersComponent>;
export const Containers: Story = {};
Containers.args = {};
