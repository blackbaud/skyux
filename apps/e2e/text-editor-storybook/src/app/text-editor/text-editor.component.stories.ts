import { provideRouter } from '@angular/router';
import {
  Meta,
  StoryFn,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { TextEditorComponent } from './text-editor.component';
import { TextEditorModule } from './text-editor.module';

export default {
  id: 'texteditorcomponent-texteditor',
  title: 'Components/Text Editor',
  component: TextEditorComponent,
  decorators: [
    // Needed to address the 'No provider for ActivatedRoute!' for standalone components.
    // See: https://github.com/storybookjs/storybook/issues/21218
    applicationConfig({
      providers: [provideRouter([])],
    }),
    moduleMetadata({
      imports: [TextEditorModule],
    }),
  ],
} as Meta<TextEditorComponent>;
const BaseTextEditor: StoryFn<TextEditorComponent> = (
  args: TextEditorComponent
) => ({
  props: args,
});

export const TextEditorBasic = BaseTextEditor.bind({});

export const TextEditorDisabled = BaseTextEditor.bind({});
TextEditorDisabled.args = {
  disabledFlag: true,
};

export const TextEditorInlineHelp = BaseTextEditor.bind({});
TextEditorInlineHelp.args = {
  inlineHelpFlag: true,
};
