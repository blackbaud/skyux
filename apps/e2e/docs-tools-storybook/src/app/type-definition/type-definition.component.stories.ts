import { provideRouter } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import {
  DIRECTIVE_DEFINITIONS,
  OTHER_DEFINITIONS,
  SERVICE_DEFINITIONS,
} from './type-definition-fixtures';
import { TypeDefinitionComponent } from './type-definition.component';

export default {
  id: 'type-definitioncomponent',
  title: 'Components/Type Definition',
  component: TypeDefinitionComponent,
  decorators: [
    // Needed to address the 'No provider for ActivatedRoute!' for standalone components.
    // See: https://github.com/storybookjs/storybook/issues/21218
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
} as Meta<TypeDefinitionComponent>;
type Story = StoryObj<TypeDefinitionComponent>;

export const TypeDefinitionDirective: Story = {};
TypeDefinitionDirective.args = {
  definitions: DIRECTIVE_DEFINITIONS,
};

export const TypeDefinitionService: Story = {};
TypeDefinitionService.args = {
  definitions: SERVICE_DEFINITIONS,
};

export const TypeDefinitionOther: Story = {};
TypeDefinitionOther.args = {
  definitions: OTHER_DEFINITIONS,
};
