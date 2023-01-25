import { Component, Inject, Input, OnInit, Optional } from '@angular/core';

import { GreetingService } from './greeting/greeting.service';

@Component({
  selector: 'sky-dynamic-component-test',
  template: `<div class="component-test">
    {{ message }}
    <ng-container *ngIf="greeting">{{ greeting }}</ng-container>
  </div>`,
})
export class DynamicComponentTestComponent implements OnInit {
  @Input()
  public message: string | undefined;

  #greetingSvc: GreetingService | undefined;

  constructor(
    @Inject('greeting') @Optional() public greeting?: string,
    @Optional() greetingSvc?: GreetingService
  ) {
    this.#greetingSvc = greetingSvc;
  }

  public ngOnInit(): void {
    this.message = this.#greetingSvc
      ? this.#greetingSvc.sayHello()
      : 'Hello world';
  }
}
