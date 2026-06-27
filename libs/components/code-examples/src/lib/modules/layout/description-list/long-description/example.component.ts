import { Component } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';

/**
 * @title Long-description mode
 */
@Component({
  selector: 'app-layout-description-list-long-description-example',
  templateUrl: './example.component.html',
  imports: [SkyDescriptionListModule],
})
export class LayoutDescriptionListLongDescriptionExampleComponent {
  protected items: { term: string; description: string }[] = [
    {
      term: 'Good Health and Well-being',
      description:
        'Ensure healthy lives and promote well-being for all at all ages.',
    },
    {
      term: 'Quality Education',
      description:
        'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.',
    },
    {
      term: 'Gender Equity',
      description: 'Achieve gender equality and empower all women and girls.',
    },
  ];
}
