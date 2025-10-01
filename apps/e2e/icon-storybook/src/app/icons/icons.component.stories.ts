import type { Meta, StoryObj } from '@storybook/angular';

import { IconsComponent } from './icons.component';

export default {
  id: 'iconscomponent',
  title: 'Components/Icons',
  component: IconsComponent,
} as Meta<IconsComponent>;
type Story = StoryObj<IconsComponent>;

export const IconsS: Story = {};
IconsS.args = { size: 's' };
export const IconsM: Story = {};
IconsM.args = { size: 'm' };
export const IconsL: Story = {};
IconsL.args = { size: 'l' };
export const IconsXL: Story = {};
IconsXL.args = { size: 'xl' };
export const IconsXXL: Story = {};
IconsXXL.args = { size: 'xxl' };
