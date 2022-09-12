import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

@Component({
  selector: 'sky-character-counter-indicator',
  templateUrl: './character-counter-indicator.component.html',
  styleUrls: ['./character-counter-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyCharacterCounterIndicatorComponent {
  #_currentCharacterCountLimit = 0;
  #_currentCharacterCount = 0;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  public get characterCount(): number {
    return this.#_currentCharacterCount;
  }

  public set characterCount(count: number) {
    this.#_currentCharacterCount = count;
    this.#changeDetector.markForCheck();
  }

  public get characterCountLimit(): number {
    return this.#_currentCharacterCountLimit;
  }

  public set characterCountLimit(limit: number) {
    this.#_currentCharacterCountLimit = limit;
    this.#changeDetector.markForCheck();
  }
}
