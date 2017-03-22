import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class StacheHeroComponent {
  @Input('backgroundImageUrl')
  set backgroundImageUrl(value: string) {
    this._backgroundImageUrl = value;
  }

  get backgroundImageUrl(): string {
    return this._backgroundImageUrl;
  }

  private _backgroundImageUrl: string = 'none';
}
