import { Component, EnvironmentInjector } from '@angular/core';

import { SkyDynamicComponentService } from '../dynamic-component.service';

import { DynamicComponentTestComponent } from './dynamic-component-test.component.fixture';

@Component({
  selector: 'sky-lazy-loaded-test',
  template: `<button class="click-me" type="button" (click)="createComponent()">
    Click me
  </button>`,
  standalone: false,
})
export class LazyLoadedTestComponent {
  #dynamicComponentSvc: SkyDynamicComponentService;
  #injector: EnvironmentInjector;

  constructor(
    dynamicComponentSvc: SkyDynamicComponentService,
    injector: EnvironmentInjector,
  ) {
    this.#dynamicComponentSvc = dynamicComponentSvc;
    this.#injector = injector;
  }

  public createComponent(): void {
    this.#dynamicComponentSvc.createComponent(DynamicComponentTestComponent, {
      environmentInjector: this.#injector, // <-- pass in the LazyLoadedTestModule's injector
    });
  }
}
