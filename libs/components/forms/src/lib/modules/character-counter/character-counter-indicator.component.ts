import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'sky-character-counter-indicator',
  templateUrl: './character-counter-indicator.component.html',
  styleUrls: ['./character-counter-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyCharacterCounterIndicatorComponent {
  #_characterCountLimit = 0;
  #_characterCount = 0;

  #changeDetector: ChangeDetectorRef;

  constructor(changeDetector: ChangeDetectorRef) {
    this.#changeDetector = changeDetector;
  }

  public get characterCount(): number {
    return this.#_characterCount;
  }

  @Input()
  public set characterCount(count: number) {
    this.#_characterCount = count;
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
