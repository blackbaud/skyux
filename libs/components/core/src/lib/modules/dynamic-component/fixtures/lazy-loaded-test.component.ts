import {
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  inject,
} from '@angular/core';

import { SkyDynamicComponentService } from '../dynamic-component.service';

import { DynamicComponentTestComponent } from './dynamic-component-test.component.fixture';

@Component({
  selector: 'sky-lazy-loaded-test',
  template: `<button class="click-me" type="button" (click)="createComponent()">
    Click me
  </button>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LazyLoadedTestComponent {
  readonly #dynamicComponentSvc = inject(SkyDynamicComponentService);
  readonly #injector = inject(EnvironmentInjector);

  public createComponent(): void {
    this.#dynamicComponentSvc.createComponent(DynamicComponentTestComponent, {
      environmentInjector: this.#injector, // <-- pass in the LazyLoadedTestModule's injector
    });
  }
}
