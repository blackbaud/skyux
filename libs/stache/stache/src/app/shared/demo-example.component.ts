import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-demo-example',
  template: `
    <h2>Code:</h2>
    <stache-code code="{{code}}"></stache-code>
    <h2>Result:</h2>
    <div class="stache-demo-example-result">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./demo-example.component.scss']
})
export class StacheDemoExampleComponent {
  @Input()
  public code: string;
}
