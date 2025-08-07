import { Meta, moduleMetadata } from '@storybook/angular';

import { AvatarComponent } from './avatar.component';
import { AvatarModule } from './avatar.module';

export default {
  id: 'avatarcomponent-avatar',
  title: 'Components/Avatar',
  component: AvatarComponent,
  decorators: [
    moduleMetadata({
      imports: [AvatarModule],
    }),
  ],
} as Meta<AvatarComponent>;
export const Avatar = {
  render: (args: AvatarComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
