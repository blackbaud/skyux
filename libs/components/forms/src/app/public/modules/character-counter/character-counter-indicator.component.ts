import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-character-counter-indicator',
  templateUrl: './character-counter-indicator.component.html',
  styleUrls: ['./character-counter-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyCharacterCounterIndicatorComponent {
  public characterCountMessage: string;
  public overLimitMessage: string;

  private currentCharacterCountLimit: number = 0;
  private currentCharacterCount: number = 0;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public get characterCount(): number {
    return this.currentCharacterCount;
  }

  public set characterCount(count: number) {
    this.currentCharacterCount = count;
    this.changeDetector.markForCheck();
  }

  public get characterCountLimit(): number {
    return this.currentCharacterCountLimit;
  }

  public set characterCountLimit(limit: number) {
    this.currentCharacterCountLimit = limit;
    this.changeDetector.markForCheck();
  }
}
