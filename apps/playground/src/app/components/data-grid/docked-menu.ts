import { Component, inject } from '@angular/core';
import { isActive, Router, RouterLink } from '@angular/router';
import { DockedInModalButtonComponent } from './docked-in-modal/docked-in-modal-button.component';

@Component({
  selector: 'app-docked-menu',
  template: `
    @for (item of menuItems; track item.label) {
      @if (!item.active()) {
        <button
          class="sky-btn sky-btn-default"
          type="button"
          [routerLink]="item.routerLink"
        >
          {{ item.label }}
        </button>
      }
    }
    <app-docked-in-modal-button />
  `,
  styles: `
    :host {
      display: flex;
      gap: var(--sky-theme-space-inline-l);
    }
  `,
  imports: [RouterLink, DockedInModalButtonComponent],
})
export class DockedMenuComponent {
  readonly #router = inject(Router);
  protected readonly menuItems = [
    {
      label: 'Docked in a fit layout page',
      routerLink: '/components/data-grid/docked-in-fit-layout',
      active: isActive(
        '/components/data-grid/docked-in-fit-layout',
        this.#router,
      ),
    },
    {
      label: 'Docked with Data Manager',
      routerLink: '/components/data-grid/docked-with-data-manager',
      active: isActive(
        '/components/data-grid/docked-with-data-manager',
        this.#router,
      ),
    },
    {
      label: 'Docked in a tabs page',
      routerLink: '/components/data-grid/docked-tabs',
      active: isActive('/components/data-grid/docked-tabs', this.#router),
    },
  ];
}
