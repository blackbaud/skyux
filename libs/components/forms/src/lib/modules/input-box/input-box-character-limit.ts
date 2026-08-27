import { Component, computed, input, linkedSignal } from '@angular/core';
import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

@Component({
  imports: [SkyFormsResourcesModule],
  selector: 'sky-input-box-character-limit',
  styleUrl: './input-box-character-limit.scss',
  templateUrl: './input-box-character-limit.html',
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

  // Holds the count steady between milestones so screen readers announce it
  // periodically instead of on every keystroke.
  protected readonly announcedCount = linkedSignal<number, number>({
    source: this.characterCount,
    computation: (characterCount, previous) => {
      const characterLimit = this.characterLimit();

      // Announce every 10 characters within 50 of the limit, every 50 otherwise.
      const interval =
        characterLimit - Math.floor(characterCount / 10) * 10 <= 50 ? 10 : 50;

      // The limit is worth announcing even when it doesn't fall on an interval.
      if (
        previous === undefined || // is this the first value assignment?
        characterCount === characterLimit || // has the count reached the limit?
        characterCount % interval === 0 // is the count a multiple of the interval?
      ) {
        return characterCount;
      }

      // The previous announcement may be the limit, which doesn't always fall
      // on an interval, so round both counts down before comparing them.
      const previousMilestone =
        Math.floor(previous.value / interval) * interval;
      const currentMilestone = Math.floor(characterCount / interval) * interval;

      // Stay quiet while the count is still at the announced milestone or has
      // dipped just below it, so deleting one character doesn't drop the
      // announcement from 50 to 40.
      if (
        currentMilestone === previousMilestone ||
        currentMilestone + interval === previousMilestone
      ) {
        return previous.value;
      }

      // Typing can't skip a milestone, so the value was replaced wholesale and
      // the previous announcement is stale -- for example, 43 of 50 to 21 of 50.
      return currentMilestone;
    },
  });
}
