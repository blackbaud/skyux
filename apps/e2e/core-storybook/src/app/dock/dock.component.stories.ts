import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { DockComponent } from './dock.component';
import { DockModule } from './dock.module';

export default {
  id: 'dockcomponent-dock',
  title: 'Components/Dock',
  component: DockComponent,
  decorators: [
    moduleMetadata({
      imports: [DockModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<DockComponent>;
const Template: Story<DockComponent> = (args: DockComponent) => ({
  props: args,
});
export const Dock = Template.bind({});
Dock.args = {};
