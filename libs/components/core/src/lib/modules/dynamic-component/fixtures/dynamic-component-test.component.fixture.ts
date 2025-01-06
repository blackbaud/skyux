import {
  Component,
  Inject,
  Input,
  OnInit,
  Optional,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { GreetingService } from './greeting/greeting.service';

@Component({
  selector: 'sky-dynamic-component-test',
  template: `<div class="component-test">
      {{ message }}
      <!-- prettier-ignore -->
      @if (greeting) {{{ greeting }}}
    </div>
    <div #content></div>`,
  standalone: false,
})
export class DynamicComponentTestComponent implements OnInit {
  @Input()
  public message: string | undefined;

  #greetingSvc: GreetingService | undefined;

  @ViewChild('content', {
    read: ViewContainerRef,
    static: false,
  })
  public content: ViewContainerRef | undefined;

  constructor(
    @Inject('greeting') @Optional() public greeting?: string,
    @Optional() greetingSvc?: GreetingService,
  ) {
    this.#greetingSvc = greetingSvc;
  }

  public ngOnInit(): void {
    this.message = this.#greetingSvc
      ? this.#greetingSvc.sayHello()
      : 'Hello world';
  }
}
