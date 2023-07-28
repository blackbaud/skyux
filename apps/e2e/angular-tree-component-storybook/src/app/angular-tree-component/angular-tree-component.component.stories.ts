import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

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
export const BasicAngularTreeComponent: StoryFn<
  AngularTreeComponentComponent
> = (args: AngularTreeComponentComponent) => ({
  props: args,
});

export const SelectionMultiSelectAngularTreeComponent =
  BasicAngularTreeComponent.bind({});
SelectionMultiSelectAngularTreeComponent.args = {
  useCheckbox: true,
  allowCascading: false,
};

export const SelectionMultiSelectCascadingAngularTreeComponent =
  BasicAngularTreeComponent.bind({});
SelectionMultiSelectCascadingAngularTreeComponent.args = {
  useCheckbox: true,
};

export const SelectionSingleSelectAngularTreeComponent =
  BasicAngularTreeComponent.bind({});
SelectionSingleSelectAngularTreeComponent.args = {
  singleSelectFlag: true,
  useCheckbox: true,
  allowCascading: false,
};

export const ModesAngularTreeComponent = BasicAngularTreeComponent.bind({});
ModesAngularTreeComponent.args = {
  showModes: true,
};
