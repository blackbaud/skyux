import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-rich-text-display-fixture',
  templateUrl: './rich-text-display-fixture.component.html',
  standalone: false,
})
export class RichTextDisplayFixtureComponent {
  public richText = input<string | undefined>(undefined);
}
