import { Component, Injector, Type, inject } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import {
  λ18 as SkyDescriptionListComponent,
  λ21 as SkyDescriptionListContentComponent,
  λ20 as SkyDescriptionListDescriptionComponent,
  λ19 as SkyDescriptionListTermComponent,
} from '@skyux/layout';

@Component({
  selector: 'app-description-list',
  templateUrl: './description-list.component.html',
})
export class DescriptionListComponent {
  public items: { term: string; description: string; showHelp?: boolean }[] = [
    {
      term: 'College',
      description: 'Humanities and Social Sciences',
    },
    {
      term: 'Department',
      description: 'Anthropology',
    },
    {
      term: 'Advisor',
      description: 'Cathy Green',
      showHelp: true,
    },
    {
      term: 'Class year',
      description: '2024',
    },
  ];

  #injector = inject(Injector);

  constructor() {
    const register = (component: Type<unknown>, name: string): void => {
      const customEl = createCustomElement(component, {
        injector: this.#injector,
      });

      customElements.define(name, customEl);
    };

    register(SkyDescriptionListComponent, 'skyux-description-list');
    register(
      SkyDescriptionListContentComponent,
      'skyux-description-list-content'
    );
    register(
      SkyDescriptionListDescriptionComponent,
      'skyux-description-list-description'
    );
    register(SkyDescriptionListTermComponent, 'skyux-description-list-term');
  }
}
