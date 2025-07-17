import { Component } from '@angular/core';

import { GreetingService } from './greeting/greeting.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'div.tile1',
  templateUrl: './tile1.component.html',
  standalone: false,
})
export class Tile1Component {
  #greetingSvc: GreetingService;

  constructor(greetingSvc: GreetingService) {
    this.#greetingSvc = greetingSvc;
  }

  public get greeting(): string {
    return this.#greetingSvc.sayHello();
  }

  protected settingsClick(): void {
    alert('Settings clicked!');
  }
}
