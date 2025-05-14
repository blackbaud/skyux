import { Meta, moduleMetadata } from '@storybook/angular';

import { ToolbarComponent } from './toolbar.component';
import { ToolbarModule } from './toolbar.module';

export default {
  id: 'toolbarcomponent-toolbar',
  title: 'Components/Toolbar',
  component: ToolbarComponent,
  decorators: [
    moduleMetadata({
      imports: [ToolbarModule],
    }),
  ],
} as Meta<ToolbarComponent>;
export const Toolbar = {
  render: (args: ToolbarComponent): { props: unknown } => ({ props: args }),
  args: {},
};
