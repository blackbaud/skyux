import {
  FONT_LIST_DEFAULTS
} from './font-list-defaults';

import {
  SkyTextEditorStyleState
} from '../types/style-state';

/**
 * @internal
 */
export const STYLE_STATE_DEFAULTS: SkyTextEditorStyleState = {
  backColor: 'rgba(0, 0, 0, 0)',
  fontColor: '#000',
  fontSize: 14,
  font: FONT_LIST_DEFAULTS[0].value,
  boldState: false,
  italicState: false,
  underlineState: false,
  linkState: false
};
