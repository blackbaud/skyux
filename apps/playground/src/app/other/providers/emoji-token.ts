import { InjectionToken } from '@angular/core';

import { EmojiService } from './emoji.service';

export const EMOJI = new InjectionToken<string>('emoji');

export const EMOJI_SERVICES = new InjectionToken<EmojiService[]>(
  'EMOJI_SERVICES'
);
