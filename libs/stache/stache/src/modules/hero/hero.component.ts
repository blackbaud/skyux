import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class StacheHeroComponent {
  @Input()
  set backgroundImageUrl(imageUrl: string) {
    this._backgroundImageUrl = imageUrl;
  }

  get backgroundImageUrl(): string {
    return this._backgroundImageUrl;
  }

  private _backgroundImageUrl = 'none';
}
