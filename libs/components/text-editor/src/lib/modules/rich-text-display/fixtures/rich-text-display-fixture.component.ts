import { Component } from '@angular/core';

@Component({
  selector: 'sky-rich-text-display-fixture',
  templateUrl: './rich-text-display-fixture.component.html',
  standalone: false,
})
export class RichTextDisplayFixtureComponent {
  public richText: string | undefined;
}
