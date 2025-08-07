import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';

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

type Story = StoryObj<FileAttachmentComponent>;

export const FileAttachmentBasic: Story = {};
FileAttachmentBasic.args = {
  basic: true,
};

export const FileAttachmentImageUploaded: Story = {};
FileAttachmentImageUploaded.args = {
  addedFiles: true,
};

export const FileAttachmentNoPreview: Story = {};
FileAttachmentNoPreview.args = {
  noPreview: true,
};
