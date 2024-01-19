import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
import { SkyLiveAnnouncerService } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { take } from 'rxjs/operators';

@Component({
  selector: 'sky-character-counter-indicator',
  templateUrl: './character-counter-indicator.component.html',
  styleUrls: ['./character-counter-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyCharacterCounterIndicatorComponent {
  #_characterCountLimit = 0;
  #_characterCount = 0;

  #changeDetector = inject(ChangeDetectorRef);
  #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);
  #resourceSvc = inject(SkyLibResourcesService);

  public get characterCount(): number {
    return this.#_characterCount;
  }

  @Input()
  public set characterCount(count: number) {
    this.#_characterCount = count;
    this.#changeDetector.markForCheck();

    this.announceToScreenReader();
  }

  public get characterCountLimit(): number {
    return this.#_characterCountLimit;
  }

  @Input()
  public set characterCountLimit(limit: number) {
    this.#_characterCountLimit = limit;
    this.#changeDetector.markForCheck();
  }

  /** @internal */
  public announceToScreenReader(alwaysAnnounce = false): void {
    if (this.characterCount > this.characterCountLimit) {
      this.#resourceSvc
        .getString('skyux_character_count_over_limit')
        .pipe(take(1))
        .subscribe((overLimitString) => {
          this.#liveAnnouncerSvc.announce(overLimitString);
        });
    } else {
      // We want to announce every 10 characters if we are within 50 of the limit or every 50 otherwise.
      const modulus =
        this.characterCountLimit - this.characterCount <= 50 ? 10 : 50;

      // Announce if set to always announce. Otherwise, announce if at the limit or at one of the points described in the previous comment.
      if (
        alwaysAnnounce ||
        this.characterCount === this.characterCountLimit ||
        this.characterCount % modulus === 0
      ) {
        this.#resourceSvc
          .getString(
            'skyux_character_count_message',
            this.characterCount.toLocaleString(),
            this.characterCountLimit.toLocaleString(),
          )
          .pipe(take(1))
          .subscribe((characterCountMessage) => {
            this.#liveAnnouncerSvc.announce(characterCountMessage);
          });
      }
    }
  }

  /** @internal */
  public clearScreenReader(): void {
    this.#liveAnnouncerSvc.clear();
  }
}
