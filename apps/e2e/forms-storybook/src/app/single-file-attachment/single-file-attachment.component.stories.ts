import { Meta, moduleMetadata } from '@storybook/angular';

import { SingleFileAttachmentComponent } from './single-file-attachment.component';
import { SingleFileAttachmentModule } from './single-file-attachment.module';

export default {
  id: 'singlefileattachmentcomponent-singlefileattachment',
  title: 'Components/Single File Attachment',
  component: SingleFileAttachmentComponent,
  decorators: [
    moduleMetadata({
      imports: [SingleFileAttachmentModule],
    }),
  ],
} as Meta<SingleFileAttachmentComponent>;
export const SingleFileAttachment = {
  render: (args: SingleFileAttachmentComponent): { props: unknown } => ({
    props: args,
  }),
  args: {},
};
