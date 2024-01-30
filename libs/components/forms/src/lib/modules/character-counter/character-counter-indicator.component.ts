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
  #_hasFocus = false;
  #_characterCountLimit = 0;
  #_characterCount = 0;

  #changeDetector = inject(ChangeDetectorRef);

  public set hasFocus(value: boolean) {
    this.#_hasFocus = value;
    this.#changeDetector.markForCheck();
  }

  public get hasFocus(): boolean {
    return this.#_hasFocus;
  }

  public get characterCount(): number {
    return this.#_characterCount;
  }

  @Input()
  public set characterCount(count: number) {
    this.#_characterCount = count;
    this.hasFocus = false;
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
