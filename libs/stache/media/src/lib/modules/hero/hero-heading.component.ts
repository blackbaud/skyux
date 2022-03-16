import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sky-hero-heading',
  templateUrl: './hero-heading.component.html',
  styleUrls: ['./hero-heading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyHeroHeadingComponent {
  @Input()
  public heroTextColor = '#fff';
}
