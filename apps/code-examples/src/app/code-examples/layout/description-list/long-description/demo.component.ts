import { Component } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyDescriptionListModule],
})
export class DemoComponent {
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
