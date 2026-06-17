import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'sky-trim-test',
  templateUrl: './trim-test.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyTrimTestComponent {
  protected readonly dynamicText = input('Some dynamic test');
  protected readonly firstText = input(' First');
  protected readonly lastText = input('last ');
}
