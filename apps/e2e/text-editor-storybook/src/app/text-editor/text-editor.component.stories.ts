import { Meta, moduleMetadata } from '@storybook/angular';

import { TextEditorComponent } from './text-editor.component';
import { TextEditorModule } from './text-editor.module';

export default {
  id: 'texteditorcomponent-texteditor',
  title: 'Components/Text Editor',
  component: TextEditorComponent,
  decorators: [
    moduleMetadata({
      imports: [TextEditorModule],
    }),
  ],
} as Meta<TextEditorComponent>;
export const TextEditor = {
  render: (args: TextEditorComponent) => ({
    props: args,
  }),
  args: {},
};
