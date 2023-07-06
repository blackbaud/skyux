import { SkyFileItem } from '@skyux/forms';
import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';

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
const BaseSingleFileAttachment: StoryFn<SingleFileAttachmentComponent> = (
  args: SingleFileAttachmentComponent
) => ({
  props: args,
});

export const SingleFileAttachmentStates = BaseSingleFileAttachment.bind({});

export const SingleFileAttachmentImage = BaseSingleFileAttachment.bind({});
SingleFileAttachmentImage.args = {
  uploadedFiles: {
    file: {
      name: 'myImage.jpg',
      type: 'image/jpeg',
      size: 976,
    },
    url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCADDAK8DASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAgJ/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AuwEPs4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/2Q==',
  } as SkyFileItem,
};

export const SingleFileAttachmentTxtFile = BaseSingleFileAttachment.bind({});
SingleFileAttachmentTxtFile.args = {
  uploadedFiles: {
    file: {
      name: 'myFile.txt',
      size: 100,
    },
  } as SkyFileItem,
};
