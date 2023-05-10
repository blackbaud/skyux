import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { ActionHubComponent } from './action-hub.component';
import { ActionHubModule } from './action-hub.module';

export default {
  id: 'actionhubcomponent-actionhub',
  title: 'Components/Action Hub',
  component: ActionHubComponent,
  decorators: [
    moduleMetadata({
      imports: [ActionHubModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<ActionHubComponent>;
const Template: Story<ActionHubComponent> = (args: ActionHubComponent) => ({
  props: args,
});
export const ActionHub = Template.bind({});
ActionHub.args = {};
