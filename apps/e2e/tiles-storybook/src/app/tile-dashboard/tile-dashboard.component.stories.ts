import { importProvidersFrom } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Meta,
  Story,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { TileDashboardComponent } from './tile-dashboard.component';
import { TileDashboardModule } from './tile-dashboard.module';

export default {
  id: 'tiledashboardcomponent-tiledashboard',
  title: 'Components/Tile Dashboard',
  component: TileDashboardComponent,
  decorators: [
    moduleMetadata({
      imports: [TileDashboardModule],
    }),
    // Define application-wide providers with the applicationConfig decorator
    applicationConfig({
      providers: [importProvidersFrom(NoopAnimationsModule)],
    }),
  ],
} as Meta<TileDashboardComponent>;
const Template: Story<TileDashboardComponent> = (
  args: TileDashboardComponent
) => ({
  props: args,
});
export const TileDashboard = Template.bind({});
TileDashboard.args = {};
