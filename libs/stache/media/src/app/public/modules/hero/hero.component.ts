import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'sky-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyHeroComponent {

  @Input()
  public backgroundImageUrl: string;

  @Input()
  public set overlayOpacity(value: string) {
    const sanitized = value.replace(/[^\d.-]/g, '');
    const newValue = this.parseInterval(sanitized).toString();
    this._overlayOpacity = newValue;
    this.changeDetector.markForCheck();
  }

  public get overlayOpacity(): string {
    return this._overlayOpacity || this.defaultOpacity;
  }

  private readonly defaultOpacity = '0.4';

  private _overlayOpacity: string;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  private parseInterval(value: string): number {
    let interval = parseFloat(value);

    if (isNaN(interval)) {
      return 0.4;
    }

    if (interval > 100) {
      return 1;
    }

    if (interval < 0) {
      return 0;
    }

    if (interval % 1 > 0) {
      return interval;
    }

    return interval / 100;
  }
}
