import { Meta, moduleMetadata } from '@storybook/angular';

import { FileAttachmentComponent } from './file-attachment.component';
import { FileAttachmentModule } from './file-attachment.module';

export default {
  id: 'fileattachmentcomponent-fileattachment',
  title: 'Components/File Attachment',
  component: FileAttachmentComponent,
  decorators: [
    moduleMetadata({
      imports: [FileAttachmentModule],
    }),
  ],
} as Meta<FileAttachmentComponent>;
export const FileAttachment = {
  render: (args: FileAttachmentComponent) => ({
    props: args,
  }),
  args: {},
};
