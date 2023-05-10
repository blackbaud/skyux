import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { BordersComponent } from './borders.component';
import { BordersModule } from './borders.module';

export default {
  id: 'borderscomponent-borders',
  title: 'Components/Borders',
  component: BordersComponent,
  decorators: [
    moduleMetadata({
      imports: [BordersModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<BordersComponent>;
const Template: Story<BordersComponent> = (args: BordersComponent) => ({
  props: args,
});
export const Borders = Template.bind({});
Borders.args = {};
