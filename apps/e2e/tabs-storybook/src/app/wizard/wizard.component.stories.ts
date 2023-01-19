import { Meta, Story, moduleMetadata } from '@storybook/angular';

import { WizardComponent } from './wizard.component';
import { WizardModule } from './wizard.module';

/* spell-checker:ignore wizardcomponent */
export default {
  id: 'wizardcomponent-wizard',
  title: 'Components/Wizard',
  component: WizardComponent,
  decorators: [
    moduleMetadata({
      imports: [WizardModule],
    }),
  ],
} as Meta<WizardComponent>;
const Template: Story<WizardComponent> = (args: WizardComponent) => ({
  props: args,
});
export const Wizard = Template.bind({});
Wizard.args = {};
