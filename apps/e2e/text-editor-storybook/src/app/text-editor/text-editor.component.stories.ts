import { provideRouter } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

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
type Story = StoryObj<TextEditorComponent>;

export const TextEditorBasic: Story = {};
TextEditorBasic.args = {};

export const TextEditorDisabled: Story = {};
TextEditorDisabled.args = {
  disabledFlag: true,
};

export const TextEditorInlineHelp: Story = {};
TextEditorInlineHelp.args = {
  inlineHelpFlag: true,
};
