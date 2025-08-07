import { Component, TemplateRef, ViewChild, inject } from '@angular/core';

import { SkyDescriptionListContentComponent } from './description-list-content.component';

/**
 * Specifies the term in a term-description pair. To display a help button beside
 * the term, include a help button element in the sky-description-list-term element
 * and a sky-control-help CSS class on that element.
 */
@Component({
  selector: 'sky-description-list-term',
  templateUrl: './description-list-term.component.html',
  styleUrl: './description-list-term.component.scss',
  standalone: false,
})
export class SkyDescriptionListTermComponent {
  @ViewChild('termTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public templateRef: TemplateRef<unknown> | undefined;

  protected readonly content = inject(SkyDescriptionListContentComponent, {
    optional: true,
  });
}
