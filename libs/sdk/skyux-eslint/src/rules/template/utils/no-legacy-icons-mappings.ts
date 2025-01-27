import { LegacyIconReplacement } from './types';

/**
 * A map of legacy icons to their replacements.
 */
export const LegacyIconReplacements: Record<string, LegacyIconReplacement> = {
  'plus-circle': { newName: 'add' },
  add: { newName: 'add' },
  check: { newName: 'checkmark' },
  pencil: { newName: 'edit' },
  trash: { newName: 'delete' },
  edit: { newName: 'edit' },
  'trash-o': { newName: 'delete' },
  close: { newName: 'dismiss' },
  // 'warning': 'warning',
  star: { newName: 'star' },
  ban: { newName: 'ban' },
  'bb-diamond-2-solid': { newName: 'bb-diamond', variant: 'solid' },
};
