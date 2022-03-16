import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-test-page-anchor',
  templateUrl: './page-anchor.component.fixture.html',
})
export class StachePageAnchorTestComponent {
  @Input()
  public anchorContent: string;

  @Input()
  public anchorId: string;
}
