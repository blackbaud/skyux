import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-description-list-demo',
  templateUrl: './description-list-demo.component.html'
})
export class DescriptionListDemoComponent {

  public items: { term: string, description: string }[] = [
    {
      term: 'Good Health and Well-being',
      description: 'Ensure healthy lives and promote well-being for all at all ages.'
    },
    {
      term: 'Quality Education',
      description: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.'
    },
    {
      term: 'Gender Equity',
      description: 'Achieve gender equality and empower all women and girls.'
    }
  ];

}
