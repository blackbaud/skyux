import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';

import { GREETING_TOKEN } from './greeting-token.fixture';
import { GreetingService } from './greeting/greeting.service';

@Component({
  selector: 'sky-dynamic-component-test',
  template: `<div class="component-test">
      {{ message }}
      <!-- prettier-ignore -->
      @if (greeting) {{{ greeting }}}
    </div>
    <div #content></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DynamicComponentTestComponent implements OnInit {
  @Input()
  public message: string | undefined;

  @ViewChild('content', {
    read: ViewContainerRef,
    static: false,
  })
  public content: ViewContainerRef | undefined;

  readonly #greetingSvc = inject(GreetingService, { optional: true });
  public readonly greeting = inject(GREETING_TOKEN, { optional: true });

  public ngOnInit(): void {
    this.message = this.#greetingSvc
      ? this.#greetingSvc.sayHello()
      : 'Hello world';
  }
}
