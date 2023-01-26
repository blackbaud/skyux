import { Component, Injector } from '@angular/core';

import { SkyDynamicComponentService } from '../dynamic-component.service';

import { DynamicComponentTestComponent } from './dynamic-component-test.component.fixture';

@Component({
  selector: 'sky-lazy-loaded-test',
  template: `<button class="click-me" type="button" (click)="createComponent()">
    Click me
  </button>`,
})
export class LazyLoadedTestComponent {
  #dynamicComponentSvc: SkyDynamicComponentService;
  #injector: Injector;

  constructor(
    dynamicComponentSvc: SkyDynamicComponentService,
    injector: Injector
  ) {
    this.#dynamicComponentSvc = dynamicComponentSvc;
    this.#injector = injector;
  }

  public createComponent(): void {
    this.#dynamicComponentSvc.createComponent(DynamicComponentTestComponent, {
      parentInjector: this.#injector, // <-- pass in the LazyLoadedTestModule's injector
    });
  }
}
