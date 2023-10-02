import {
  Directive,
  EnvironmentInjector,
  TemplateRef,
  inject,
} from '@angular/core';

import { SkyDynamicComponentLocation } from '../dynamic-component/dynamic-component-location';
import { SkyDynamicComponentService } from '../dynamic-component/dynamic-component.service';
import { SkyIdService } from '../id/id.service';

import { SkyScreenReaderOnlyComponent } from './screen-reader-only.component';

/**
 * Add the template content to a screen reader only section of the body.
 * This prevents components' DOM from including text only intended for screen readers.
 */
@Directive({
  selector: '[skyScreenReaderOnly]',
  exportAs: 'skyScreenReaderOnly',
  standalone: true,
})
export class SkyScreenReaderOnlyDirective {
  public get id(): string {
    return this.#_id;
  }

  public set id(value: string) {
    this.#_id = value;
  }

  readonly #dynamicComponentSvc = inject(SkyDynamicComponentService);
  readonly #templateRef = inject(TemplateRef);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #idSvc = inject(SkyIdService);
  #_id = '';

  constructor() {
    this.id = this.#idSvc.generateId();

    const componentRef = this.#dynamicComponentSvc.createComponent(
      SkyScreenReaderOnlyComponent,
      {
        location: SkyDynamicComponentLocation.BodyBottom,
        environmentInjector: this.#environmentInjector,
      }
    );

    componentRef.instance.attachTemplate(this.#templateRef, this.id);
  }
}
