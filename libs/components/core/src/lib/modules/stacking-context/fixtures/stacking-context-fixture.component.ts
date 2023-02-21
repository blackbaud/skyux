import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'sky-stacking-context-fixture',
  templateUrl: './stacking-context-fixture.component.html',
  styleUrls: ['./stacking-context-fixture.component.css'],
})
export class StackingContextFixtureComponent {
  constructor(public elementRef: ElementRef) {}
}
