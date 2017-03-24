import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'stache-demo-example',
  template: `
    <h2>Demo</h2>
    <div class="stache-demo-example-result">
      <ng-content></ng-content>
    </div>
    <h2>Code</h2>
    <stache-code-block code="{{code}}"></stache-code-block>
  `,
  styleUrls: ['./demo1-example.component.scss']
})
export class StacheDemoExampleComponent implements OnInit {
  @Input()
  public code: string;

  public ngOnInit(): void {}
}
