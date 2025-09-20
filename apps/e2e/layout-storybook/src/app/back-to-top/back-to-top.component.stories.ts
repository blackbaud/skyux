import { Meta, moduleMetadata } from '@storybook/angular';

import { BackToTopComponent } from './back-to-top.component';
import { BackToTopModule } from './back-to-top.module';

export default {
  id: 'backtotopcomponent-backtotop',
  title: 'Components/Back To Top',
  component: BackToTopComponent,
  decorators: [
    moduleMetadata({
      imports: [BackToTopModule],
    }),
  ],
} as Meta<BackToTopComponent>;
export const BackToTop = {
  render: (args: BackToTopComponent): { props: unknown } => ({ props: args }),
  args: {},
};
