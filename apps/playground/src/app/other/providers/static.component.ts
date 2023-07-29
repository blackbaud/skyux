import { Component, SkipSelf } from '@angular/core';

import { OtherEmojiModule } from './emoji-other.module';
import { EMOJI_SERVICES } from './emoji-token';
import { EmojiComponent } from './emoji.component';
import { EmojiService } from './emoji.service';

@Component({
  standalone: true,
  imports: [OtherEmojiModule, EmojiComponent],
  selector: 'app-static',
  template: `<app-emoji />`,
  providers: [
    {
      provide: EMOJI_SERVICES,
      useFactory: function (svc: EmojiService[]) {
        return [new EmojiService('?'), ...svc];
      },
      multi: true,
      deps: [[new SkipSelf(), EMOJI_SERVICES]],
    },
  ],
})
export default class StaticComponent {}
