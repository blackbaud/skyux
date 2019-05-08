import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'sky-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class SkyHeroComponent {
  @Input()
  public backgroundImageUrl: string;

  @Input()
  set overlayOpacity(opacityCandidate: string) {
    let sanitizedCandidate = opacityCandidate.replace(/[^\d.-]/g, '');
    let parsedInterval = this.parseInterval(sanitizedCandidate);
    this._overlayOpacity = parsedInterval.toString();
  }

  get overlayOpacity(): string {
    return this._overlayOpacity || this.defaultOpacity;
  }

  private readonly defaultOpacity: string = '0.4';
  private _overlayOpacity: string;

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
