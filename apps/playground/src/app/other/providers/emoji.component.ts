import {
  Component,
  EnvironmentInjector,
  Injector,
  inject,
} from '@angular/core';

import { EMOJI_SERVICES } from './emoji-token';
import { EmojiModule } from './emoji.module';

@Component({
  standalone: true,
  selector: 'app-emoji',
  template: `<div>Cool emoji {{ emojis }}</div> `,
  imports: [EmojiModule],
})
export class EmojiComponent {
  #emojiServices = inject(EMOJI_SERVICES);
  #injector = inject(Injector);
  #environmentInjector = inject(EnvironmentInjector);

  public get emojis(): string {
    console.log(
      'emojis in this env injector (comp)',
      this.#environmentInjector
        .get(EMOJI_SERVICES)
        .map((x) => x.emoji)
        .join(':')
    );

    console.log(
      'emojis in this injector (comp)',
      this.#injector
        .get(EMOJI_SERVICES)
        .map((x) => x.emoji)
        .join(':')
    );

    return this.#emojiServices.map((s) => s.emoji).join(' | ');
  }
}
