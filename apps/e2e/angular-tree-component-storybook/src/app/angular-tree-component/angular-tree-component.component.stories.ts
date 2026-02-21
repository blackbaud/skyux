import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AngularTreeComponentComponent } from './angular-tree-component.component';
import { AngularTreeComponentModule } from './angular-tree-component.module';

export default {
  id: 'angulartreecomponentcomponent-angulartreecomponent',
  title: 'Components/Angular Tree Component',
  component: AngularTreeComponentComponent,
  decorators: [
    moduleMetadata({
      imports: [AngularTreeComponentModule],
    }),
  ],
} as Meta<AngularTreeComponentComponent>;

type Story = StoryObj<AngularTreeComponentComponent>;

export const BasicAngularTreeComponent: Story = {};
BasicAngularTreeComponent.args = {};

export const SelectionMultiSelectAngularTreeComponent: Story = {};
SelectionMultiSelectAngularTreeComponent.args = {
  useCheckbox: true,
  allowCascading: false,
};

export const SelectionMultiSelectCascadingAngularTreeComponent: Story = {};
SelectionMultiSelectCascadingAngularTreeComponent.args = {
  useCheckbox: true,
};

export const SelectionSingleSelectAngularTreeComponent: Story = {};
SelectionSingleSelectAngularTreeComponent.args = {
  singleSelectFlag: true,
  useCheckbox: true,
  allowCascading: false,
};

export const ModesAngularTreeComponent: Story = {};
ModesAngularTreeComponent.args = {
  showModes: true,
};
