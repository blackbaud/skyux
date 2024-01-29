import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';

@Component({
  selector: 'sky-character-counter-indicator',
  templateUrl: './character-counter-indicator.component.html',
  styleUrls: ['./character-counter-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyCharacterCounterIndicatorComponent {
  #_alwaysAnnounce = false;
  #_characterCountLimit = 0;
  #_characterCount = 0;

  #changeDetector = inject(ChangeDetectorRef);

  public set alwaysAnnounce(value: boolean) {
    this.#_alwaysAnnounce = value;
    this.#changeDetector.markForCheck();
  }

  public get alwaysAnnounce(): boolean {
    return this.#_alwaysAnnounce;
  }

  public get characterCount(): number {
    return this.#_characterCount;
  }

  @Input()
  public set characterCount(count: number) {
    this.#_characterCount = count;
    this.alwaysAnnounce = false;
    this.#changeDetector.markForCheck();
  }

  public get characterCountLimit(): number {
    return this.#_characterCountLimit;
  }

  @Input()
  public set characterCountLimit(limit: number) {
    this.#_characterCountLimit = limit;
    this.#changeDetector.markForCheck();
  }
}
