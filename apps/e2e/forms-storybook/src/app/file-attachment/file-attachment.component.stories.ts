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

export const FileAttachment = BaseFileAttachment.bind({});

export const FileAttachmentImage = BaseFileAttachment.bind({});
FileAttachmentImage.args = {
  addedFiles: true,
};

export const FileAttachmentInlineHelp = BaseFileAttachment.bind({});
FileAttachmentInlineHelp.args = {
  includeInlineHelp: true,
};

export const FileAttachmentNoLinks = BaseFileAttachment.bind({});
FileAttachmentNoLinks.args = {
  allowLinks: false,
};
