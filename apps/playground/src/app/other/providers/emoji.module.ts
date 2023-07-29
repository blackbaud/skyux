import { NgModule } from '@angular/core';

import { EMOJI_SERVICES } from './emoji-token';
import { EmojiService } from './emoji.service';

@NgModule({
  providers: [
    {
      provide: EMOJI_SERVICES,
      useFactory: function (): EmojiService {
        return new EmojiService('♥');
      },
      multi: true,
    },
  ],
})
export class EmojiModule {}
