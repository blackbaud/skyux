import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

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
const BaseFileAttachment: StoryFn<FileAttachmentComponent> = (
  args: FileAttachmentComponent
) => ({
  props: args,
});

export const FileAttachmentBasic = BaseFileAttachment.bind({});
FileAttachmentBasic.args = {
  basic: true,
};

export const FileAttachmentImageUploaded = BaseFileAttachment.bind({});
FileAttachmentImageUploaded.args = {
  addedFiles: true,
};

export const FileAttachmentNoPreview = BaseFileAttachment.bind({});
FileAttachmentNoPreview.args = {
  noPreview: true,
};
