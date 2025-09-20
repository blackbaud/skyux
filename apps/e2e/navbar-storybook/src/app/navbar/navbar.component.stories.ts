import { Meta, moduleMetadata } from '@storybook/angular';

import { NavbarComponent } from './navbar.component';
import { NavbarModule } from './navbar.module';

export default {
  id: 'navbarcomponent-navbar',
  title: 'Components/Navbar',
  component: NavbarComponent,
  decorators: [
    moduleMetadata({
      imports: [NavbarModule],
    }),
  ],
} as Meta<NavbarComponent>;
export const Navbar = {
  render: (args: NavbarComponent): { props: unknown } => ({ props: args }),
  args: {},
};
