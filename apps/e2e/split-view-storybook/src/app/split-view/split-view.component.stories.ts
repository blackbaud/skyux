import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { SplitViewDockFillComponent } from './split-view.component';
import { SplitViewModule } from './split-view.module';

export default {
  id: 'splitviewcomponent-splitview',
  title: 'Components/Split View',
  component: SplitViewDockFillComponent,
  decorators: [
    moduleMetadata({
      imports: [SplitViewModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<SplitViewDockFillComponent>;
const Template: Story<SplitViewDockFillComponent> = (
  args: SplitViewDockFillComponent
) => ({
  props: args,
});
export const SplitView = Template.bind({});
SplitView.args = {};
