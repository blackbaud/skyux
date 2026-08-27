import { Component, computed, input } from '@angular/core';
import { SkyInputBoxCharacterLimitAnnouncer } from './input-box-character-limit-announcer';

@Component({
  imports: [SkyInputBoxCharacterLimitAnnouncer],
  selector: 'sky-input-box-character-limit',
  template: `
    <span
      class="sky-character-count-label sky-font-deemphasized"
      [class.sky-error-label]="limitReached()"
    >
      {{ ratio() }}
    </span>
    <sky-input-box-character-limit-announcer
      [characterCount]="characterCount()"
      [characterLimit]="characterLimit()"
    />
  `,
})
export class SkyInputBoxCharacterLimit {
  public readonly characterCount = input.required<number>();
  public readonly characterLimit = input.required<number>();

  protected readonly ratio = computed(() => {
    return `${this.characterCount()}/${this.characterLimit()}`;
  });

  protected readonly limitReached = computed(() => {
    return this.characterCount() > this.characterLimit();
  });
}
