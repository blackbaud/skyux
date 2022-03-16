import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-test-component',
  templateUrl: './page-header.component.fixture.html',
})
export class StachePageHeaderTestComponent {
  @Input()
  public headerText: string;
}
