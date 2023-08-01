import { addons } from '@storybook/addons';
import { ThemeVars } from '@storybook/theming';

import { blackbaud } from './blackbaud';

addons.setConfig({
  theme: blackbaud as Required<ThemeVars>,
});
