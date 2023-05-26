import { Meta, moduleMetadata } from '@storybook/angular';

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
export const AngularTreeComponent = {
  render: (args: AngularTreeComponentComponent) => ({
    props: args,
  }),
  args: {},
};
