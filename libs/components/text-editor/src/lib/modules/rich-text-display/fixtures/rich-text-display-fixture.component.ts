import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-rich-text-display-fixture',
  templateUrl: './rich-text-display-fixture.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RichTextDisplayFixtureComponent {
  public richText: string | undefined;
}
