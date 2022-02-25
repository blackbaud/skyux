import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sky-dynamic-component-test',
  template: '<div class="component-test">{{ message }}</div>',
})
export class DynamicComponentTestComponent implements OnInit {
  @Input()
  public message: string;

  public ngOnInit(): void {
    this.message = 'Hello world';
  }
}
